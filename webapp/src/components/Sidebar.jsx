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

import * as Icons from './Icons'

import registry from '../registry'

import style from '@styles/sidebar.scss'

const Sidebar = () => {
  return (
    <div className={style.wrapper}>
      <div className={style.container}>
        <Link to='/' className={style.logo} aria-label='Squirrel Chat'>
          <Icons.Logo/>
        </Link>
        <div className={style.contents}>
          {registry.map(cat => {
            const Icon = Icons[cat.icon]
            return (
              <React.Fragment key={cat.name}>
                <div className={style.sectionTitle}>
                  <Icon width={32} height={32}/>
                  <span>{cat.name}</span>
                </div>
                {cat.items.map(item => (
                  <NavLink key={item.slug} to={item.slug} activeClassName={style.active} className={style.sectionItem}>
                    {item.title}
                  </NavLink>
                ))}
              </React.Fragment>
            )
          })}
        </div>
        <div className={style.footer}>
          <div>
            Copyright &copy; {new Date().getFullYear()} Squirrel Chat
          </div>
          <div>
            <a href='https://squirrel.chat/'>Website</a>
            <a rel='noreferrer' target='_blank' href='https://github.com/squirrelchat/documentation'>GitHub</a>
            <a rel='noreferrer' target='_blank' href='https://discord.gg/qAPpZDr'>Discord</a>
            <a href='https://squirrel.chat/legal'>Legal Notice</a>
          </div>
        </div>
      </div>
    </div>
  )
}

Sidebar.displayName = 'Sidebar'
export default React.memo(Sidebar)
