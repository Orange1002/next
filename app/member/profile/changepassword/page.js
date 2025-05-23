'use client'

import React from 'react'
import SectionTitle from '../../_components/SectionTitle/layout'
import BtnCustom from '../../_components/BtnCustom/layout'
import styles from './changepassword.module.css'

export default function ChangePasswordPage() {
  return (
    <>
      <SectionTitle>修改密碼</SectionTitle>
      <div className="mt-lg-3 h-100">
        <div className={`${styles.block} p-lg-5 h-100`}>
          <form>
            <div className={`d-flex flex-column justify-content-between`}>
              <div className="mb-3">
                <label htmlFor="currentPassword" className="form-label">
                  請輸入舊密碼
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="currentPassword"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">
                  請輸入新密碼
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="newPassword"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  再次輸入新密碼
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                />
              </div>
            </div>
            <div className="d-flex justify-content-center mt-lg-5">
              <BtnCustom>確認修改</BtnCustom>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
