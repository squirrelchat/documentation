/*
 * Copyright (c) 2020 Squirrel Chat, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react'
import { Link, NavLink } from 'react-router-dom'

import { Logo, Atom, Api } from './Icons'

import style from '@styles/sidebar.scss'

const Sidebar = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <Link to='/' className={style.logo} aria-label='Squirrel Chat'>
          <Logo/>
        </Link>
        <div className={style.contents}>
          <div className={style.sectionTitle}>
            <Atom width={32} height={32}/>
            <span>Getting started</span>
          </div>
          <NavLink to='/' activeClassName={style.active} className={style.sectionItem}>Section Item 1</NavLink>
          <div className={style.sectionItem}>
            <span>Section Item 2</span>
          </div>
          <div className={style.sectionItem}>
            <span>Section Item 3</span>
          </div>
          <div className={style.sectionTitle}>
            <Api width={32} height={32}/>
            <span>REST API</span>
          </div>
          <div className={style.sectionItem}>
            <span>Section Item 1</span>
          </div>
          <div className={style.sectionItem}>
            <span>Section Item 2</span>
          </div>
          <div className={style.sectionItem}>
            <span>Section Item 3</span>
          </div>
        </div>
        <div className={style.footer}>
          <div>
            Copyright &copy; {new Date().getFullYear()} Squirrel Chat
          </div>
          <div>
            <a href='/'>Website</a>
            <a rel='noreferrer' target='_blank' href='https://github.com/squirrelchat/documentation'>GitHub</a>
            <a rel='noreferrer' target='_blank' href='https://discord.gg/qAPpZDr'>Discord</a>
            <a href='/legal'>Legal Notice</a>
          </div>
        </div>
      </div>
    </div>
  )
}

Sidebar.displayName = 'Sidebar'
export default React.memo(Sidebar)
