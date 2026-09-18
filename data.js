/**
 * ============================================================
 *  站点数据文件（唯一数据源）
 *  ------------------------------------------------------------
 *  修改方式（任选其一）：
 *  1) 在 GitHub 网页端打开本文件 -> 点击铅笔图标编辑 -> Commit
 *  2) 打开 admin.html 可视化编辑 -> 导出 data.js 内容 -> 覆盖本文件
 *
 *  相册图片：放入 images/photos/ 目录，src 填相对路径，
 *  如 "images/photos/xxx.jpg"
 * ============================================================
 */
window.SITE_DATA = {
  "hero": {
    "name": "郭启超",
    "pinyin": "Guo Qichao",
    "title": "高级工程师 | SDCIT & Ericsson",
    "tags": ["AI大模型与智能体", "5G核心网", "云计算与容器化", "网络安全", "DevOps与自动化运维"],
    "bio": "拥有近20年高校与ICT行业工作经验，先后从事过教学、3/4/5G核心网和无线网络支撑管理系统交付运维、云原生平台系统集成和移动网络平台安全防护体系建设的研究和交付工作。从事过系统工程师、IT项目管理、部门管理等多个岗位。积累了软件产品全流程管理、ICT工程师体系化培养经验，具备技术落地与商业价值转化的能力；现专注于AI智能体协同开发、5G核心网自动化运维、网络安全等领域的教学与研究。",
    "cv_url": "#"
  },

  "expertise": [
    {"icon": "brain", "title": "AI智能体开发", "desc": "掌握DeepSeek、Qwen等大模型架构部署，熟练运用DS/Gemini/OpenAI/Claude结合开源框架，具备RAG知识库搭建与AI多智能体协同开发能力。"},
    {"icon": "radio-tower", "title": "5G核心网技术", "desc": "专注5G专网、边缘计算、UPF技术架构，参与中国移动多期5G商用网络集采测试与FOA技术验证。"},
    {"icon": "cloud", "title": "云计算与容器化", "desc": "深度参与爱立信自研的电信云平台（CEE虚拟化/CCD容器化）在运营商体系内的集成交付，掌握OpenStack/Kubernetes交付能力。"},
    {"icon": "shield-check", "title": "网络安全工程", "desc": "持有CISP认证、数据治理和高级网络信息安全工程师证书，多次参与运营商HW安全保障及网络渗透测试技术支持。"},
    {"icon": "database", "title": "大数据", "desc": "熟悉Flink+Kafka实时大数据架构，精通PostgreSQL/MySQL/MongoDB等数据库系统的管理与性能优化。"},
    {"icon": "terminal", "title": "DevOps与自动化运维", "desc": "熟悉Scrum/DevOps方法论，掌握Ansible/cobber/Puppet/Python/Perl，主持开发多个IT自动化运维工具和平台。"}
  ],

  "experience": [
    {"current": true, "period": "当前", "role": "专任教师", "org": "山东信息职业技术学院 · 网络安全专业", "desc": "负责网络安全专业的教学任务，致力于将行业实践经验融入人才培养。"},
    {"current": false, "period": "2023.06 — 2026.03", "role": "解决方案架构师", "org": "爱立信（中国）通信有限公司 · 数字服务业务部", "desc": "聚焦AI大模型产品交付与实施，主导本地化开发适配；完成容器化网管平台改造及无线网AI智能板CP5-CP7集采测试；搭建基于RAG框架的北方区技术支持知识库；开发基于Glean/N8N平台的差旅合规预检、邮件管理等AI智能体应用。"},
    {"current": false, "period": "2016.11 — 2023.06", "role": "部门经理", "org": "爱立信（中国）通信有限公司 · 数字服务业务部", "desc": "将部门从19人扩展至53人；拓展业务至计费系统、AI能力开发、云平台技术支持和定制化软件开发；主持开发《网管自动健康检查及告警软件》《PMT性能数据监控软件》《爱立信计费5G核心网CHF网元信令跟踪系统》等产品；通过多技能培养优化交付成本，每年节约20余万元。"},
    {"current": false, "period": "2014.12 — 2016.11", "role": "项目经理", "org": "爱立信（中国）通信有限公司 · 数字服务业务部PMO", "desc": "作为技术组长和项目经理参与山东移动第一期5G商用网络建设；负责OMC、BSS、MANO等产品交付，围绕XLPM（基于PMI体系）实现项目交付标准化与流程化。"},
    {"current": false, "period": "2010.11 — 2014.11", "role": "系统工程师", "org": "爱立信（中国）通信有限公司 · 技术服务支持中心GTC/EOC SI", "desc": "对GPON光网络、IP数通、OMC产品进行现场/远程技术支持；参与山东移动连续四期4G LTE商用网络建设（2012-2015）；2015年开发《网管自动过滤告警及网元故障自愈合》工具（Python），荣获山东移动自动化运维创新奖。"},
    {"current": false, "period": "2005.07 — 2010.10", "role": "教师", "org": "山东电子职业技术学院 · 计算机系", "desc": "留校从事实验指导及计算机网络、硬件组装与维修（数据恢复方向）、数据库等课程教学；连续多年获\"优秀教育工作者\"；2次代表山东省参加全国计算机调试员大赛，获团队一等奖和\"山东省电子信息行业技术能手\"称号；参与《计算机组装与维修》山东省省级高校精品课程编写。"}
  ],

  "papers": [
    {"title": "智能建筑中通信自动化技术的应用探析", "authors": "郭启超", "venue": "数字化用户"},
    {"title": "数字化管理手段在建筑工程施工中的应用", "authors": "郭启超", "venue": "地产"},
    {"title": "微服务架构中API接口安全防护技术研究", "authors": "郭启超", "venue": "电商"},
    {"title": "分布式防火墙系统设计与网络流量过滤技术", "authors": "郭启超", "venue": "电脑采购"},
    {"title": "《电信行业安全攻防演练标准》编制", "authors": "", "venue": "工业和信息化部"}
  ],

  "patents": [
    {"title": "基于云边协同的数据信息传输方法", "number": "CN120281773B", "status": "已授权"},
    {"title": "一种阳极炭块抗压强度预测方法", "number": "CN120108608B", "status": "已授权"},
    {"title": "一种仿生鱼机器人水下运动控制系统", "number": "CN120085683B", "status": "已授权"},
    {"title": "一种自动助力转向系统控制方法", "number": "CN120281773B", "status": "已授权"},
    {"title": "基于大数据的医疗仓库管理办法", "number": "—", "status": "已公布"},
    {"title": "一种建筑内部通信电信号处理方法", "number": "CN120281773B", "status": "已授权"},
    {"title": "一种面向肺炎影像的CT图像自适应增强方法", "number": "CN120707428A", "status": "已授权"}
  ],

  "copyrights": [
    {"name": "ENM服务器Pipeline自动升级软件", "number": "2025SR1380252", "year": "2025"},
    {"name": "5G无线网1Min北向管理系统", "number": "2025SR0188393", "year": "2025"},
    {"name": "数据安全与容灾备份管理系统", "number": "2024SR1617218", "year": "2024"},
    {"name": "人工智能预测评估系统", "number": "2024SR1141621", "year": "2024"},
    {"name": "EleStar大数据存储库运维管理系统", "number": "2023SR1215366", "year": "2023"}
  ],

  "projects": [
    {"role": "解决方案架构师", "date": "2025/10—2026/3", "title": "河北移动智能北向、1分钟PM数据采集架构改造项目和中国移动5G无线网CP7 FOA测试项目"},
    {"role": "技术负责人", "date": "2025/05—2025/08", "title": "北京联通网络渗透HW技术支持（中央网信办/工信部/公安部三部委检查）"},
    {"role": "负责人", "date": "2025/02—2025/04", "title": "中国移动CP7无线网AI智能板CMCC集团采集测试项目"},
    {"role": "架构师", "date": "2024/02—2024/07", "title": "中国联通集团AI能力上台项目"},
    {"role": "主持", "date": "2023/03—2023/12", "title": "中国移动爱立信容器化网管平台改造和FOA测试项目"},
    {"role": "主持", "date": "2021/11—2022/06", "title": "中国移动智慧中台AI能力上台（AMF网元性能预测）项目"},
    {"role": "参与", "date": "2024/08—2024/11", "title": "苏州移动\"通感一体\"6G网络测试"},
    {"role": "参与", "date": "2021/03—2022/01", "title": "中国移动5GC SA虚拟化核心网CP1-CP2"},
    {"role": "参与", "date": "2018/12—2019/04", "title": "青岛海军节安全保障"},
    {"role": "参与", "date": "2017/11—2018/07", "title": "青岛上合峰会安全保障"},
    {"role": "参与", "date": "2016/05—2017/04", "title": "日本Docomo NFV虚拟化OpenStack云平台"},
    {"role": "参与", "date": "2012/05—2016/05", "title": "山东移动LTE网络建设CP1-CP4"},
    {"role": "参与", "date": "2011/05—2012/05", "title": "甘肃/宁夏/新疆移动省级OSS扩容"},
    {"role": "参与", "date": "2010/12—2011/05", "title": "山西联通爱立信GPON光网络设备接入"}
  ],

  "ai": [
    {"icon": "bot", "title": "教学三件套智能体", "en": "Teaching Trio Agent", "desc": "为某一门课程端到端生成「教学PPT + 教案（教学实施过程版 + 知识点版）+ 实训操作手册」三件套，以对话方式按周次/课时产出教学资源。"},
    {"icon": "clipboard-check", "title": "岗位能力调研智能体", "en": "Capability Survey Orchestrator", "desc": "围绕岗位能力调研全流程：访谈引导、问卷部署与回收、数据质量校验、岗位能力图谱可视化与调研报告生成。"},
    {"icon": "palette", "title": "科技蓝教学课件风格", "en": "TechBlue Teaching Style", "desc": "基于教学能力审定PPT提炼的「科技蓝·深蓝渐变」课件风格系统，新建课件、说课、教学能力大赛 PPT 时可直接套用，风格统一可控。"},
    {"icon": "shield-check", "title": "实训室建设方案评估专家", "en": "Infosec Lab Evaluation Skill", "desc": "基于六大维度 43 项细分指标评估信息安全实训室建设方案，输出评分汇总、扣分项清单与厂家答复检查清单。"},
    {"icon": "plane", "title": "企业 AI 智能体应用", "en": "Enterprise AI Agents", "desc": "基于 Glean / N8N 平台开发差旅合规预检、邮件管理等 AI 智能体应用，落地企业内网场景的自动化与智能检索。"},
    {"icon": "library", "title": "RAG 技术支持知识库", "en": "RAG Support Knowledge Base", "desc": "基于 RAG 框架搭建北方区技术支持知识库，将产品文档与故障经验向量化，实现检索增强问答。"},
    {"icon": "terminal", "title": "AI 编程与自动化工具", "en": "AI Coding & Automation Tools", "desc": "开发网管自动过滤告警及网元故障自愈合工具（Python）、自动健康检查软件等，将 AI 与运维自动化结合。"}
  ],

  "thinking": [
    {"icon": "layers", "title": "思维模型库", "desc": "金字塔原理、第一性原理、二八法则等，按场景选用。"},
    {"icon": "network", "title": "知识网络", "desc": "卡片笔记法，原子化记录 + 链接形成个人知识网络。"},
    {"icon": "target", "title": "决策与聚焦", "desc": "机会成本清单、OKR 聚焦，明确放弃什么、优先什么。"},
    {"icon": "refresh-cw", "title": "复盘与迭代", "desc": "PDCA 循环、KPT 复盘，从 Keep / Problem / Try 沉淀经验。"},
    {"icon": "messages-square", "title": "提问沉淀", "desc": "长期咨询聚焦岗位能力调研、网络安全教学、课程与教学资源、问卷调研、数据采集与招聘等主题，其余零散问题不再收录。"}
  ],

  "certs": [
    {"icon": "shield", "title": "高级网络信息安全工程师", "date": "2025/07"},
    {"icon": "lock", "title": "CISP注册信息安全工程师", "date": "2025/07"},
    {"icon": "cpu", "title": "系统架构设计师（高级）", "date": "2025/05"},
    {"icon": "bar-chart-3", "title": "DAMA CDGA数据治理工程师", "date": "2024/06"},
    {"icon": "clipboard-list", "title": "信息系统项目管理师（高级）", "date": "2023/11"},
    {"icon": "settings", "title": "系统集成项目管理工程师（中级）", "date": "2023/05"},
    {"icon": "award", "title": "PMP项目管理专业人员认证", "date": "2015/12"},
    {"icon": "network", "title": "思科CCNA网络工程师", "date": "2012/09"},
    {"icon": "network", "title": "红帽RHCE认证", "date": "2011/09"},
    {"icon": "network", "title": "山东省电子信息产业技术能手", "date": "2006/11"},
    {"icon": "network", "title": "二级技师", "date": "2006/11"},
    {"icon": "network", "title": "阿里云ACP认证", "date": "2022/05"}
  ],

  "photos": [
    {"category": "会议", "title": "示例照片（请替换）", "date": "2026", "src": "images/photos/", "desc": "把照片放入 images/photos/ 目录后，在 data.js 中修改 src 为实际文件名即可。"}
  ]
};
