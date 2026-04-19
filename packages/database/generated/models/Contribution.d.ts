import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type ContributionModel = runtime.Types.Result.DefaultSelection<Prisma.$ContributionPayload>;
export type AggregateContribution = {
    _count: ContributionCountAggregateOutputType | null;
    _avg: ContributionAvgAggregateOutputType | null;
    _sum: ContributionSumAggregateOutputType | null;
    _min: ContributionMinAggregateOutputType | null;
    _max: ContributionMaxAggregateOutputType | null;
};
export type ContributionAvgAggregateOutputType = {
    amount: number | null;
};
export type ContributionSumAggregateOutputType = {
    amount: number | null;
};
export type ContributionMinAggregateOutputType = {
    id: string | null;
    prId: string | null;
    amount: number | null;
    status: string | null;
    userId: string | null;
};
export type ContributionMaxAggregateOutputType = {
    id: string | null;
    prId: string | null;
    amount: number | null;
    status: string | null;
    userId: string | null;
};
export type ContributionCountAggregateOutputType = {
    id: number;
    prId: number;
    amount: number;
    status: number;
    userId: number;
    _all: number;
};
export type ContributionAvgAggregateInputType = {
    amount?: true;
};
export type ContributionSumAggregateInputType = {
    amount?: true;
};
export type ContributionMinAggregateInputType = {
    id?: true;
    prId?: true;
    amount?: true;
    status?: true;
    userId?: true;
};
export type ContributionMaxAggregateInputType = {
    id?: true;
    prId?: true;
    amount?: true;
    status?: true;
    userId?: true;
};
export type ContributionCountAggregateInputType = {
    id?: true;
    prId?: true;
    amount?: true;
    status?: true;
    userId?: true;
    _all?: true;
};
export type ContributionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ContributionWhereInput;
    orderBy?: Prisma.ContributionOrderByWithRelationInput | Prisma.ContributionOrderByWithRelationInput[];
    cursor?: Prisma.ContributionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ContributionCountAggregateInputType;
    _avg?: ContributionAvgAggregateInputType;
    _sum?: ContributionSumAggregateInputType;
    _min?: ContributionMinAggregateInputType;
    _max?: ContributionMaxAggregateInputType;
};
export type GetContributionAggregateType<T extends ContributionAggregateArgs> = {
    [P in keyof T & keyof AggregateContribution]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateContribution[P]> : Prisma.GetScalarType<T[P], AggregateContribution[P]>;
};
export type ContributionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ContributionWhereInput;
    orderBy?: Prisma.ContributionOrderByWithAggregationInput | Prisma.ContributionOrderByWithAggregationInput[];
    by: Prisma.ContributionScalarFieldEnum[] | Prisma.ContributionScalarFieldEnum;
    having?: Prisma.ContributionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ContributionCountAggregateInputType | true;
    _avg?: ContributionAvgAggregateInputType;
    _sum?: ContributionSumAggregateInputType;
    _min?: ContributionMinAggregateInputType;
    _max?: ContributionMaxAggregateInputType;
};
export type ContributionGroupByOutputType = {
    id: string;
    prId: string;
    amount: number;
    status: string;
    userId: string;
    _count: ContributionCountAggregateOutputType | null;
    _avg: ContributionAvgAggregateOutputType | null;
    _sum: ContributionSumAggregateOutputType | null;
    _min: ContributionMinAggregateOutputType | null;
    _max: ContributionMaxAggregateOutputType | null;
};
export type GetContributionGroupByPayload<T extends ContributionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ContributionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ContributionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ContributionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ContributionGroupByOutputType[P]>;
}>>;
export type ContributionWhereInput = {
    AND?: Prisma.ContributionWhereInput | Prisma.ContributionWhereInput[];
    OR?: Prisma.ContributionWhereInput[];
    NOT?: Prisma.ContributionWhereInput | Prisma.ContributionWhereInput[];
    id?: Prisma.StringFilter<"Contribution"> | string;
    prId?: Prisma.StringFilter<"Contribution"> | string;
    amount?: Prisma.FloatFilter<"Contribution"> | number;
    status?: Prisma.StringFilter<"Contribution"> | string;
    userId?: Prisma.StringFilter<"Contribution"> | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type ContributionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    prId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type ContributionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    prId?: string;
    AND?: Prisma.ContributionWhereInput | Prisma.ContributionWhereInput[];
    OR?: Prisma.ContributionWhereInput[];
    NOT?: Prisma.ContributionWhereInput | Prisma.ContributionWhereInput[];
    amount?: Prisma.FloatFilter<"Contribution"> | number;
    status?: Prisma.StringFilter<"Contribution"> | string;
    userId?: Prisma.StringFilter<"Contribution"> | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "prId">;
export type ContributionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    prId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    _count?: Prisma.ContributionCountOrderByAggregateInput;
    _avg?: Prisma.ContributionAvgOrderByAggregateInput;
    _max?: Prisma.ContributionMaxOrderByAggregateInput;
    _min?: Prisma.ContributionMinOrderByAggregateInput;
    _sum?: Prisma.ContributionSumOrderByAggregateInput;
};
export type ContributionScalarWhereWithAggregatesInput = {
    AND?: Prisma.ContributionScalarWhereWithAggregatesInput | Prisma.ContributionScalarWhereWithAggregatesInput[];
    OR?: Prisma.ContributionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ContributionScalarWhereWithAggregatesInput | Prisma.ContributionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Contribution"> | string;
    prId?: Prisma.StringWithAggregatesFilter<"Contribution"> | string;
    amount?: Prisma.FloatWithAggregatesFilter<"Contribution"> | number;
    status?: Prisma.StringWithAggregatesFilter<"Contribution"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Contribution"> | string;
};
export type ContributionCreateInput = {
    id?: string;
    prId: string;
    amount: number;
    status?: string;
    user: Prisma.UserCreateNestedOneWithoutContributionsInput;
};
export type ContributionUncheckedCreateInput = {
    id?: string;
    prId: string;
    amount: number;
    status?: string;
    userId: string;
};
export type ContributionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    user?: Prisma.UserUpdateOneRequiredWithoutContributionsNestedInput;
};
export type ContributionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ContributionCreateManyInput = {
    id?: string;
    prId: string;
    amount: number;
    status?: string;
    userId: string;
};
export type ContributionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ContributionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ContributionListRelationFilter = {
    every?: Prisma.ContributionWhereInput;
    some?: Prisma.ContributionWhereInput;
    none?: Prisma.ContributionWhereInput;
};
export type ContributionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ContributionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    prId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type ContributionAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type ContributionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    prId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type ContributionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    prId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type ContributionSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type ContributionCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ContributionCreateWithoutUserInput, Prisma.ContributionUncheckedCreateWithoutUserInput> | Prisma.ContributionCreateWithoutUserInput[] | Prisma.ContributionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ContributionCreateOrConnectWithoutUserInput | Prisma.ContributionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ContributionCreateManyUserInputEnvelope;
    connect?: Prisma.ContributionWhereUniqueInput | Prisma.ContributionWhereUniqueInput[];
};
export type ContributionUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ContributionCreateWithoutUserInput, Prisma.ContributionUncheckedCreateWithoutUserInput> | Prisma.ContributionCreateWithoutUserInput[] | Prisma.ContributionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ContributionCreateOrConnectWithoutUserInput | Prisma.ContributionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ContributionCreateManyUserInputEnvelope;
    connect?: Prisma.ContributionWhereUniqueInput | Prisma.ContributionWhereUniqueInput[];
};
export type ContributionUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ContributionCreateWithoutUserInput, Prisma.ContributionUncheckedCreateWithoutUserInput> | Prisma.ContributionCreateWithoutUserInput[] | Prisma.ContributionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ContributionCreateOrConnectWithoutUserInput | Prisma.ContributionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ContributionUpsertWithWhereUniqueWithoutUserInput | Prisma.ContributionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ContributionCreateManyUserInputEnvelope;
    set?: Prisma.ContributionWhereUniqueInput | Prisma.ContributionWhereUniqueInput[];
    disconnect?: Prisma.ContributionWhereUniqueInput | Prisma.ContributionWhereUniqueInput[];
    delete?: Prisma.ContributionWhereUniqueInput | Prisma.ContributionWhereUniqueInput[];
    connect?: Prisma.ContributionWhereUniqueInput | Prisma.ContributionWhereUniqueInput[];
    update?: Prisma.ContributionUpdateWithWhereUniqueWithoutUserInput | Prisma.ContributionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ContributionUpdateManyWithWhereWithoutUserInput | Prisma.ContributionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ContributionScalarWhereInput | Prisma.ContributionScalarWhereInput[];
};
export type ContributionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ContributionCreateWithoutUserInput, Prisma.ContributionUncheckedCreateWithoutUserInput> | Prisma.ContributionCreateWithoutUserInput[] | Prisma.ContributionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ContributionCreateOrConnectWithoutUserInput | Prisma.ContributionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ContributionUpsertWithWhereUniqueWithoutUserInput | Prisma.ContributionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ContributionCreateManyUserInputEnvelope;
    set?: Prisma.ContributionWhereUniqueInput | Prisma.ContributionWhereUniqueInput[];
    disconnect?: Prisma.ContributionWhereUniqueInput | Prisma.ContributionWhereUniqueInput[];
    delete?: Prisma.ContributionWhereUniqueInput | Prisma.ContributionWhereUniqueInput[];
    connect?: Prisma.ContributionWhereUniqueInput | Prisma.ContributionWhereUniqueInput[];
    update?: Prisma.ContributionUpdateWithWhereUniqueWithoutUserInput | Prisma.ContributionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ContributionUpdateManyWithWhereWithoutUserInput | Prisma.ContributionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ContributionScalarWhereInput | Prisma.ContributionScalarWhereInput[];
};
export type FloatFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type ContributionCreateWithoutUserInput = {
    id?: string;
    prId: string;
    amount: number;
    status?: string;
};
export type ContributionUncheckedCreateWithoutUserInput = {
    id?: string;
    prId: string;
    amount: number;
    status?: string;
};
export type ContributionCreateOrConnectWithoutUserInput = {
    where: Prisma.ContributionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ContributionCreateWithoutUserInput, Prisma.ContributionUncheckedCreateWithoutUserInput>;
};
export type ContributionCreateManyUserInputEnvelope = {
    data: Prisma.ContributionCreateManyUserInput | Prisma.ContributionCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ContributionUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ContributionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ContributionUpdateWithoutUserInput, Prisma.ContributionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ContributionCreateWithoutUserInput, Prisma.ContributionUncheckedCreateWithoutUserInput>;
};
export type ContributionUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ContributionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ContributionUpdateWithoutUserInput, Prisma.ContributionUncheckedUpdateWithoutUserInput>;
};
export type ContributionUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ContributionScalarWhereInput;
    data: Prisma.XOR<Prisma.ContributionUpdateManyMutationInput, Prisma.ContributionUncheckedUpdateManyWithoutUserInput>;
};
export type ContributionScalarWhereInput = {
    AND?: Prisma.ContributionScalarWhereInput | Prisma.ContributionScalarWhereInput[];
    OR?: Prisma.ContributionScalarWhereInput[];
    NOT?: Prisma.ContributionScalarWhereInput | Prisma.ContributionScalarWhereInput[];
    id?: Prisma.StringFilter<"Contribution"> | string;
    prId?: Prisma.StringFilter<"Contribution"> | string;
    amount?: Prisma.FloatFilter<"Contribution"> | number;
    status?: Prisma.StringFilter<"Contribution"> | string;
    userId?: Prisma.StringFilter<"Contribution"> | string;
};
export type ContributionCreateManyUserInput = {
    id?: string;
    prId: string;
    amount: number;
    status?: string;
};
export type ContributionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ContributionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ContributionUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.FloatFieldUpdateOperationsInput | number;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ContributionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    prId?: boolean;
    amount?: boolean;
    status?: boolean;
    userId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["contribution"]>;
export type ContributionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    prId?: boolean;
    amount?: boolean;
    status?: boolean;
    userId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["contribution"]>;
export type ContributionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    prId?: boolean;
    amount?: boolean;
    status?: boolean;
    userId?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["contribution"]>;
export type ContributionSelectScalar = {
    id?: boolean;
    prId?: boolean;
    amount?: boolean;
    status?: boolean;
    userId?: boolean;
};
export type ContributionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "prId" | "amount" | "status" | "userId", ExtArgs["result"]["contribution"]>;
export type ContributionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ContributionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type ContributionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $ContributionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Contribution";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        prId: string;
        amount: number;
        status: string;
        userId: string;
    }, ExtArgs["result"]["contribution"]>;
    composites: {};
};
export type ContributionGetPayload<S extends boolean | null | undefined | ContributionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ContributionPayload, S>;
export type ContributionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ContributionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ContributionCountAggregateInputType | true;
};
export interface ContributionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Contribution'];
        meta: {
            name: 'Contribution';
        };
    };
    findUnique<T extends ContributionFindUniqueArgs>(args: Prisma.SelectSubset<T, ContributionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ContributionClient<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ContributionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ContributionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ContributionClient<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ContributionFindFirstArgs>(args?: Prisma.SelectSubset<T, ContributionFindFirstArgs<ExtArgs>>): Prisma.Prisma__ContributionClient<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ContributionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ContributionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ContributionClient<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ContributionFindManyArgs>(args?: Prisma.SelectSubset<T, ContributionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ContributionCreateArgs>(args: Prisma.SelectSubset<T, ContributionCreateArgs<ExtArgs>>): Prisma.Prisma__ContributionClient<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ContributionCreateManyArgs>(args?: Prisma.SelectSubset<T, ContributionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ContributionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ContributionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ContributionDeleteArgs>(args: Prisma.SelectSubset<T, ContributionDeleteArgs<ExtArgs>>): Prisma.Prisma__ContributionClient<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ContributionUpdateArgs>(args: Prisma.SelectSubset<T, ContributionUpdateArgs<ExtArgs>>): Prisma.Prisma__ContributionClient<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ContributionDeleteManyArgs>(args?: Prisma.SelectSubset<T, ContributionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ContributionUpdateManyArgs>(args: Prisma.SelectSubset<T, ContributionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ContributionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ContributionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ContributionUpsertArgs>(args: Prisma.SelectSubset<T, ContributionUpsertArgs<ExtArgs>>): Prisma.Prisma__ContributionClient<runtime.Types.Result.GetResult<Prisma.$ContributionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ContributionCountArgs>(args?: Prisma.Subset<T, ContributionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ContributionCountAggregateOutputType> : number>;
    aggregate<T extends ContributionAggregateArgs>(args: Prisma.Subset<T, ContributionAggregateArgs>): Prisma.PrismaPromise<GetContributionAggregateType<T>>;
    groupBy<T extends ContributionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ContributionGroupByArgs['orderBy'];
    } : {
        orderBy?: ContributionGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ContributionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetContributionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ContributionFieldRefs;
}
export interface Prisma__ContributionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ContributionFieldRefs {
    readonly id: Prisma.FieldRef<"Contribution", 'String'>;
    readonly prId: Prisma.FieldRef<"Contribution", 'String'>;
    readonly amount: Prisma.FieldRef<"Contribution", 'Float'>;
    readonly status: Prisma.FieldRef<"Contribution", 'String'>;
    readonly userId: Prisma.FieldRef<"Contribution", 'String'>;
}
export type ContributionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelect<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    include?: Prisma.ContributionInclude<ExtArgs> | null;
    where: Prisma.ContributionWhereUniqueInput;
};
export type ContributionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelect<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    include?: Prisma.ContributionInclude<ExtArgs> | null;
    where: Prisma.ContributionWhereUniqueInput;
};
export type ContributionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelect<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    include?: Prisma.ContributionInclude<ExtArgs> | null;
    where?: Prisma.ContributionWhereInput;
    orderBy?: Prisma.ContributionOrderByWithRelationInput | Prisma.ContributionOrderByWithRelationInput[];
    cursor?: Prisma.ContributionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ContributionScalarFieldEnum | Prisma.ContributionScalarFieldEnum[];
};
export type ContributionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelect<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    include?: Prisma.ContributionInclude<ExtArgs> | null;
    where?: Prisma.ContributionWhereInput;
    orderBy?: Prisma.ContributionOrderByWithRelationInput | Prisma.ContributionOrderByWithRelationInput[];
    cursor?: Prisma.ContributionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ContributionScalarFieldEnum | Prisma.ContributionScalarFieldEnum[];
};
export type ContributionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelect<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    include?: Prisma.ContributionInclude<ExtArgs> | null;
    where?: Prisma.ContributionWhereInput;
    orderBy?: Prisma.ContributionOrderByWithRelationInput | Prisma.ContributionOrderByWithRelationInput[];
    cursor?: Prisma.ContributionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ContributionScalarFieldEnum | Prisma.ContributionScalarFieldEnum[];
};
export type ContributionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelect<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    include?: Prisma.ContributionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ContributionCreateInput, Prisma.ContributionUncheckedCreateInput>;
};
export type ContributionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ContributionCreateManyInput | Prisma.ContributionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ContributionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    data: Prisma.ContributionCreateManyInput | Prisma.ContributionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ContributionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ContributionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelect<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    include?: Prisma.ContributionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ContributionUpdateInput, Prisma.ContributionUncheckedUpdateInput>;
    where: Prisma.ContributionWhereUniqueInput;
};
export type ContributionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ContributionUpdateManyMutationInput, Prisma.ContributionUncheckedUpdateManyInput>;
    where?: Prisma.ContributionWhereInput;
    limit?: number;
};
export type ContributionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ContributionUpdateManyMutationInput, Prisma.ContributionUncheckedUpdateManyInput>;
    where?: Prisma.ContributionWhereInput;
    limit?: number;
    include?: Prisma.ContributionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ContributionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelect<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    include?: Prisma.ContributionInclude<ExtArgs> | null;
    where: Prisma.ContributionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ContributionCreateInput, Prisma.ContributionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ContributionUpdateInput, Prisma.ContributionUncheckedUpdateInput>;
};
export type ContributionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelect<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    include?: Prisma.ContributionInclude<ExtArgs> | null;
    where: Prisma.ContributionWhereUniqueInput;
};
export type ContributionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ContributionWhereInput;
    limit?: number;
};
export type ContributionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ContributionSelect<ExtArgs> | null;
    omit?: Prisma.ContributionOmit<ExtArgs> | null;
    include?: Prisma.ContributionInclude<ExtArgs> | null;
};
