/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * The `DateTime` scalar type represents a DateTime
   * value as specified by
   * [iso8601](https://en.wikipedia.org/wiki/ISO_8601).
   */
  DateTime: { input: any; output: any; }
};

export type ExistingLoans = {
  __typename?: 'ExistingLoans';
  dueDate?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  interestRate?: Maybe<Scalars['Float']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  principal?: Maybe<Scalars['Int']['output']>;
  repayments?: Maybe<Array<Maybe<LoanRepayments>>>;
};

export type LoanRepayments = {
  __typename?: 'LoanRepayments';
  amount?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['Int']['output']>;
  loanId?: Maybe<Scalars['Int']['output']>;
  paymentDate?: Maybe<Scalars['DateTime']['output']>;
};

export type Query = {
  __typename?: 'Query';
  loanPayments?: Maybe<Array<Maybe<LoanRepayments>>>;
  loans?: Maybe<Array<Maybe<ExistingLoans>>>;
};

export type GetLoansQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoansQuery = { __typename?: 'Query', loans?: Array<{ __typename?: 'ExistingLoans', id?: number | null, name?: string | null, interestRate?: number | null, principal?: number | null, dueDate?: any | null, repayments?: Array<{ __typename?: 'LoanRepayments', id?: number | null, loanId?: number | null, paymentDate?: any | null } | null> | null } | null> | null };

export type GetLoanRepaymentsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLoanRepaymentsQuery = { __typename?: 'Query', loanPayments?: Array<{ __typename?: 'LoanRepayments', id?: number | null, loanId?: number | null, paymentDate?: any | null } | null> | null };


export const GetLoansDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLoans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loans"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"interestRate"}},{"kind":"Field","name":{"kind":"Name","value":"principal"}},{"kind":"Field","name":{"kind":"Name","value":"dueDate"}},{"kind":"Field","name":{"kind":"Name","value":"repayments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentDate"}}]}}]}}]}}]} as unknown as DocumentNode<GetLoansQuery, GetLoansQueryVariables>;
export const GetLoanRepaymentsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetLoanRepayments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"loanPayments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"loanId"}},{"kind":"Field","name":{"kind":"Name","value":"paymentDate"}}]}}]}}]} as unknown as DocumentNode<GetLoanRepaymentsQuery, GetLoanRepaymentsQueryVariables>;