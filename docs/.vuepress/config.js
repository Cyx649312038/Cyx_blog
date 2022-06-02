module.exports = {
    base: '/cyx_blog/',
    title: 'Cyx～',
    description: '用于平时学习记录的笔记文档',
    plugins: [
        // ["vuepress-plugin-auto-sidebar", {}],
        ["vuepress-plugin-code-copy", true],
        ['@vuepress/back-to-top'],
        ['@vuepress/nprogress']
    ],
    head: [
        ['link',{rel: 'icon', href: '/assets/images/pageLogo.png'}],
        ['meta',{name: 'author', content: 'cyx'}],
        ['meta',{name: 'Keywords', content: '个人笔记'}],
    ],
    themeConfig: {
        logo: '/assets/images/logo.png',
        lastUpdated: 'Last Updated', // string | boolean
        nav: [
            {text: '首页', link: '/'},
            {text: 'bookReading', link: '/bookReading/'},
            {text: 'typescript', link: '/typescript/'},
            {text: 'node', link: '/node/'},
            {text: 'project', link: '/project/'},
        ],
        sidebarDepth: 2,
        // displayAllHeaders: true,
        // sidebar: 'auto',
        activeHeaderLinks: false,
        sidebar: {
            '/bookReading/':[
                {
                    title:'前端书籍阅读',
                    path:'/bookReading/',
                    collapsable: false,
                    children: [
                        {
                            title: '你不知道的JS(上)',
                            path: '/bookReading/dont_know_js 01/',
                            children:[
                                {
                                    title: '1. 作用域',
                                    path: '/bookReading/dont_know_js 01/01-actionScope'
                                },
                                {
                                    title: '2. 词法作用域',
                                    path: '/bookReading/dont_know_js 01/02-lexicalScope'
                                },
                                {
                                    title: '3. 函数作用域和块作用域',
                                    path: '/bookReading/dont_know_js 01/03-funcScopeAndBlockScope'
                                },
                                {
                                    title: '4.提升',
                                    path: '/bookReading/dont_know_js 01/04-hoist'
                                },
                                {
                                    title: '5.闭包',
                                    path: '/bookReading/dont_know_js 01/05-closures'
                                },
                                {
                                    title: '6.this',
                                    path: '/bookReading/dont_know_js 01/06-this'
                                },
                                {
                                    title: '7.对象',
                                    path: '/bookReading/dont_know_js 01/07-object'
                                },
                                {
                                    title: '8.类',
                                    path: '/bookReading/dont_know_js 01/08-class'
                                },
                                {
                                    title: '9.原型',
                                    path: '/bookReading/dont_know_js 01/09-prototype'
                                },
                                {
                                    title: '10.委托',
                                    path: '/bookReading/dont_know_js 01/10-entrust'
                                },
                            ]
                        },
                        {
                            title: '你不知道的JS(中)',
                            path: '/bookReading/dont_know_js 02/',
                            children:[
                                {
                                    title: '1. 类型',
                                    path: '/bookReading/dont_know_js 02/01-type'
                                },
                                {
                                    title: '2.值',
                                    path: '/bookReading/dont_know_js 02/02-value'
                                },
                                {
                                    title: '3.原生函数',
                                    path: '/bookReading/dont_know_js 02/03-nativeFunction'
                                },
                                {
                                    title: '4.强制类型转换',
                                    path: '/bookReading/dont_know_js 02/04-Cast'
                                },
                                {
                                    title: '5.语法',
                                    path: '/bookReading/dont_know_js 02/05-grammar'
                                },
                                {
                                    title: '6.异步和性能',
                                    path: '/bookReading/dont_know_js 02/06-async'
                                },
                                {
                                    title: '7.回调',
                                    path: '/bookReading/dont_know_js 02/07-callback'
                                },
                                {
                                    title: '8.promise',
                                    path: '/bookReading/dont_know_js 02/08-promise'
                                },
                                {
                                    title: '9.生成器',
                                    path: '/bookReading/dont_know_js 02/09-generator'
                                },
                                {
                                    title: '10.程序性能',
                                    path: '/bookReading/dont_know_js 02/10-programPerformance'
                                },
                                {
                                    title: '11.性能测试与调优',
                                    path: '/bookReading/dont_know_js 02/11-performanceTestingAndTuning'
                                },
                            ]
                        },
                        {
                            title: '你不知道的JS(下)',
                            path: '/bookReading/dont_know_js 03/',
                            children:[
                                {
                                    title: '1.语法',
                                    path: '/bookReading/dont_know_js 03/01-grammar'
                                },
                                {
                                    title: '2.代码组织',
                                    path: '/bookReading/dont_know_js 03/02-codeOrganization'
                                },
                                {
                                    title: '3.异步流控制',
                                    path: '/bookReading/dont_know_js 03/03-asyncControl'
                                },
                                {
                                    title: '4.集合 ',
                                    path: '/bookReading/dont_know_js 03/04-collection'
                                },
                                {
                                    title: '5.新增API ',
                                    path: '/bookReading/dont_know_js 03/05-newApi'
                                },
                                {
                                    title: '6.元编程 ',
                                    path: '/bookReading/dont_know_js 03/06-metaProgramming'
                                },
                                {
                                    title: '7.ES6之后',
                                    path: '/bookReading/dont_know_js 03/07-afterES6'
                                },
                            ]
                        },
                        {
                            title: 'javaScript程序设计(第四版)',
                            path: '/bookReading/javaScriptRedBook/',
                            children:[
                                {
                                    title: '1.什么是javascript',
                                    path: '/bookReading/javaScriptRedBook/01-什么是javascript'
                                }, 
                                {
                                    title: '2.html中的JavaScript',
                                    path: '/bookReading/javaScriptRedBook/02-html中的JavaScript'
                                }, 
                            ]
                        },
                        {
                            title: '图解Http',
                            path: '/bookReading/illustrateHttp/',
                            children:[
                            ]
                        },
                    ]
                }
            ],
            '/typescript/': [
                {
                title: 'typescript',
                path: '/typescript/',
                children: [
                    
                ]
            },
        ],
        '/node/': [
            {
            title: 'node',
            path: '/node/',
            children: [
                {
                    title: 'node介绍',
                    path: '/node/01-node介绍',
                },
                {
                    title: 'node模块化',
                    path: '/node/02-node模块化',
                },
                {
                    title: 'node文件操作',
                    path: '/node/03-文件操作',
                },
            ]
        }
    ],
    '/project/': [
        {
        title: '项目过程相关',
        path: '/project/',
        children: [
            {
                title: '项目难点',
                path: '/project/difficulties/',
            },
            {
                title: '项目小知识',
                path: '/project/knowledge/'
            },
        ]
    },
],
        }
    },

}