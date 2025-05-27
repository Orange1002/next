'use client'

import React, { useState, useEffect } from 'react'
import '@/app/sitter/_styles/style-sitter-list.scss'

export default function SitterListLayout({ children }) {
  return (
    <>
      <div>{children}</div>
    </>
  )
}
