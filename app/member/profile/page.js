'use client'
import { redirect } from 'next/navigation'

export default function ProfilePage(props) {
  return redirect('/member/profile/info')
}
