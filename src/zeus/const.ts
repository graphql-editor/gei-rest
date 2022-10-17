/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	Anything: `scalar.Anything` as const
}

export const ReturnTypes: Record<string,any> = {
	Query:{
		restProxy:"Anything"
	},
	Anything: `scalar.Anything` as const
}

export const Ops = {
query: "Query" as const
}