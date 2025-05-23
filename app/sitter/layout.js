'use client'

import React, { useState, useEffect } from 'react'
import '@/app/sitter/_styles/style-sitter-list.scss'

export default function SitterLayout({ children }) {
  return (
    <>
      <div style={{ marginTop: '100px' }}>{children}</div>
    </>
  )
}
