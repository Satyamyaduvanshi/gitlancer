use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, Mint, TokenAccount, TokenInterface, TransferChecked};

declare_id!("JBnTbnqcvXTmw7nZ6TuLbGcY7U5b8Du7YPpK5G8nByyi");

#[program]
pub mod solux_program {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>, repo_name: String) -> Result<()> {
        let vault_state = &mut ctx.accounts.vault_state;
        vault_state.maintainer = ctx.accounts.maintainer.key();
        vault_state.repo_name = repo_name;
        vault_state.vault_bump = ctx.bumps.vault_state;
        
        msg!("Vault Initialized for repo: {}", vault_state.repo_name);
        Ok(())
    }

    pub fn distribute_bounty(
        ctx: Context<DistributeBounty>, 
        repo_name: String, 
        amount: u64, 
        pr_id: String
    ) -> Result<()> {
        let oracle_pubkey = "BckCM2MP2hv5fQXUCr52kKuxs4wFMcWXHfe6kBVdGBTF".parse::<Pubkey>().unwrap();
        require_keys_eq!(ctx.accounts.oracle.key(), oracle_pubkey, ErrorCode::UnauthorizedOracle);

        let bounty_record = &mut ctx.accounts.bounty_record;
        bounty_record.is_paid = true;

        let seeds = &[
            b"vault",
            repo_name.as_bytes(),
            &[ctx.accounts.vault_state.vault_bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = TransferChecked {
            from: ctx.accounts.vault_token_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(), 
            to: ctx.accounts.contributor_token_account.to_account_info(),
            authority: ctx.accounts.vault_state.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(), 
            cpi_accounts, 
            signer_seeds
        );

        token_interface::transfer_checked(cpi_ctx, amount, 6)?;
        msg!("Bounty of {} distributed successfully for PR #{}!", amount, pr_id);
        Ok(())
    }

    // NEW: Withdrawal feature for maintainers
    pub fn withdraw_funds(ctx: Context<WithdrawFunds>, repo_name: String, amount: u64) -> Result<()> {
        let seeds = &[
            b"vault",
            repo_name.as_bytes(),
            &[ctx.accounts.vault_state.vault_bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_accounts = TransferChecked {
            from: ctx.accounts.vault_token_account.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(), 
            to: ctx.accounts.maintainer_token_account.to_account_info(),
            authority: ctx.accounts.vault_state.to_account_info(),
        };
        
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(), 
            cpi_accounts, 
            signer_seeds
        );

        token_interface::transfer_checked(cpi_ctx, amount, 6)?;
        msg!("Maintainer withdrew {} USDC from {} vault", amount, repo_name);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(repo_name: String)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub maintainer: Signer<'info>,
    #[account(
        init,
        payer = maintainer,
        space = 8 + 32 + 4 + 100 + 1, 
        seeds = [b"vault", repo_name.as_bytes()],
        bump
    )]
    pub vault_state: Account<'info, VaultState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(repo_name: String, amount: u64, pr_id: String)]
pub struct DistributeBounty<'info> {
    pub oracle: Signer<'info>, 
    #[account(mut)]
    pub contributor: Signer<'info>, 
    #[account(
        seeds = [b"vault", repo_name.as_bytes()],
        bump = vault_state.vault_bump,
    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(
        init,
        payer = contributor,
        space = 8 + 1, 
        seeds = [b"bounty", vault_state.key().as_ref(), pr_id.as_bytes()],
        bump
    )]
    pub bounty_record: Account<'info, BountyRecord>,
    #[account(mut, constraint = vault_token_account.owner == vault_state.key())]
    pub vault_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub contributor_token_account: InterfaceAccount<'info, TokenAccount>,
    pub mint: InterfaceAccount<'info, Mint>, 
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>, 
}

#[derive(Accounts)]
#[instruction(repo_name: String)]
pub struct WithdrawFunds<'info> {
    #[account(mut)]
    pub maintainer: Signer<'info>,
    #[account(
        seeds = [b"vault", repo_name.as_bytes()],
        bump = vault_state.vault_bump,
        has_one = maintainer @ ErrorCode::UnauthorizedWithdrawal 
    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(mut, constraint = vault_token_account.owner == vault_state.key())]
    pub vault_token_account: InterfaceAccount<'info, TokenAccount>,
    #[account(mut)]
    pub maintainer_token_account: InterfaceAccount<'info, TokenAccount>,
    pub mint: InterfaceAccount<'info, Mint>, 
    pub token_program: Interface<'info, TokenInterface>,
}

#[account]
pub struct VaultState {
    pub maintainer: Pubkey,
    pub repo_name: String,
    pub vault_bump: u8,
}

#[account]
pub struct BountyRecord {
    pub is_paid: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("❌ Security Violation: This transaction was not signed by the official SOLUX Oracle.")]
    UnauthorizedOracle,
    #[msg("❌ Security: Only the maintainer of this vault can withdraw funds.")]
    UnauthorizedWithdrawal,
}