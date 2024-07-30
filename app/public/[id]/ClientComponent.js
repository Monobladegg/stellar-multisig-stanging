"use client"

import useSWR from "swr"

const fetcher = (...args) => fetch(...args).then((res) => res.json())

export function Content({ id }) {
  const { data, error } = useSWR([`https://horizon.stellar.org/accounts/${id}`], fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return <PublicNet id={id} />
}