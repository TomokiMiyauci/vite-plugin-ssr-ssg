import React from 'react'
import { useParams } from 'react-router'
import { Title } from 'react-head'

export default () => {
  const { id } = useParams<{ id: string }>()

  return (
    <>
      <div>{id}</div>

      <Title>{id}</Title>
    </>
  )
}
