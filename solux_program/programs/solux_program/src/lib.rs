use anchor_lang::prelude::*;
use anchor_spl::token_interface::{self, TokenAccount, TokenInterface, Transfer};

//address 
declare_id!("JBnTbnqcvXTmw7nZ6TuLbGcY7U5b8Du7YPpK5G8nByyi");

#[program]
pub mod solux_program {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>, repo_name: String) -> Result<()> {
        let vault_state = &mut ctx.accounts.vault_state;
        
        vault_state.maintainer = ctx.accounts.maintainer.key();
        vault_state.repo_name = repo_name;
        vault_state.vault_bump = ctx.bumps.vault_state;
        
        msg!("🏦 Vault Initialized for repo: {}", vault_state.repo_name);
        Ok(())
    }

    pub fn distribute_bounty(ctx: Context<DistributeBounty>, repo_name: String, amount: u64) -> Result<()> {
        // 🛡️ Security: Ensure the transaction was signed by your NestJS Oracle
        let oracle_pubkey = "BckCM2MP2hv5fQXUCr52kKuxs4wFMcWXHfe6kBVdGBTF".parse::<Pubkey>().unwrap();
        require_keys_eq!(ctx.accounts.oracle.key(), oracle_pubkey, ErrorCode::UnauthorizedOracle);

        let repo_name_bytes = repo_name.as_bytes();
        let bump = &[ctx.accounts.vault_state.vault_bump];
        let seeds = &[
            b"vault",
            repo_name_bytes,
            bump,
        ];
        let signer_seeds = &[&seeds[..]];

        // CPI to Token Program using the Interface
        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.contributor_token_account.to_account_info(),
            authority: ctx.accounts.vault_state.to_account_info(),
        };
        
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        token_interface::transfer(cpi_ctx, amount)?;

        msg!("💰 Bounty of {} distributed successfully!", amount);
        Ok(())
    }
}

// --- ACCOUNT STRUCTURES ---

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
#[instruction(repo_name: String)]
pub struct DistributeBounty<'info> {
    pub oracle: Signer<'info>, 

    #[account(
        seeds = [b"vault", repo_name.as_bytes()],
        bump = vault_state.vault_bump,
    )]
    pub vault_state: Account<'info, VaultState>,

    #[account(
        mut,
        constraint = vault_token_account.owner == vault_state.key()
    )]
    pub vault_token_account: InterfaceAccount<'info, TokenAccount>,

    #[account(mut)]
    pub contributor_token_account: InterfaceAccount<'info, TokenAccount>,

    pub token_program: Interface<'info, TokenInterface>, // 👈 Works with both Token & Token-2022
}

// --- STATE DEFINITIONS ---

#[account]
pub struct VaultState {
    pub maintainer: Pubkey,
    pub repo_name: String,
    pub vault_bump: u8,
}

// --- CUSTOM ERRORS ---

#[error_code]
pub enum ErrorCode {
    #[msg("❌ Security Violation: This transaction was not signed by the official SOLUX Oracle.")]
    UnauthorizedOracle,
}