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
import Helmet from 'react-helmet'
import { useLocation } from 'react-router'

import Sidebar from './Sidebar'
import Router from './Router'

import style from '@styles/main.scss'

const App = () => {
  const { hash, pathname } = useLocation()
  if (process.env.BUILD_SIDE !== 'server') {
    React.useEffect(() => {
      if (hash) {
        const element = document.querySelector(hash)
        if (element) {
          setTimeout(() => element.scrollIntoView(), 10)
          return void 0
        }
      }
      window.scrollTo(0, 0)
    }, [ pathname ])
  }

  return (
    <>
      <Helmet
        titleTemplate='%s • Squirrel Developer Documentation'
        defaultTitle='Squirrel Developer Documentation'
      >
        <meta charSet='utf8'/>
        <meta httpEquiv='Content-Type' content='text/html; charset=UTF-8'/>
        <meta name='viewport' content='width=device-width, initial-scale=1, viewport-fit=cover'/>

        <meta name='theme-color' content='#ff7b1c'/>
        <meta name='revisit-after' content='2 days'/>
        <link rel='canonical' href={`https://squirrel.chat/developers${pathname}`}/>
        <meta name='description' content='Next-gen, open-source and enterprise-ready chat platform'/>

        <meta property='og:locale' content='en_US'/>
        <meta property='og:title' content='Squirrel Chat'/>
        <meta property='og:site_name' content='Squirrel Chat'/>
        <meta property='og:url' content={`https://squirrel.chat/developers${pathname}`}/>
        <meta property='og:image' content={require('@assets/squirrel.png').default}/>
        <meta property='og:description' content='Next-gen, open-source and enterprise-ready chat platform'/>

        <meta name='twitter:card' content='summary'/>
        <meta name='twitter:site' content='@Bowser65'/>

        <link rel='dns-prefetch' href='https://fonts.googleapis.com'/>
        <link rel='dns-prefetch' href='https://cdn.jsdelivr.net'/>
        <link href='https://fonts.gstatic.com' rel='preconnect' crossorigin/>
        <link href='https://cdn.jsdelivr.net' rel='preconnect' crossorigin/>

        <link rel='shortcut icon' href={require('@assets/squirrel.ico').default}/>
        <link href='https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;800&display=swap' rel='stylesheet'/>
        <link href='https://cdn.jsdelivr.net/npm/typeface-jetbrains-mono@1.0.5/dist/index.min.css' rel='stylesheet'/>
      </Helmet>
      <Sidebar/>
      <main>
        <div className={style.contents}>
          <Router/>
        </div>
      </main>
    </>
  )
}

App.displayName = 'App'
export default React.memo(App)
