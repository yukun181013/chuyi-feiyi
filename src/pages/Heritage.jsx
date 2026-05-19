/**
 * 非遗介绍页面 - Heritage
 */
import { React } from 'react'
import { IMG, inheritorsData } from './data'

// 生成头像URL
function avatarUrl(name) {
  const colors = ['9f3b2f', '8B4513', '6B3A2A', 'A0522D', '7B2D26', '5C3317', '804020', '6A3028']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const bg = colors[Math.abs(hash) % colors.length]
  const fontSize = name.length <= 2 ? 40 : name.length === 3 ? 32 : 26
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="%23${bg}"/><text x="64" y="64" text-anchor="middle" dominant-baseline="central" fill="white" font-size="${fontSize}" font-family="'Ma Shan Zheng','STKaiti','KaiTi',sans-serif">${name}</text></svg>`
  return `data:image/svg+xml,${svg}`
}

// 时间线数据
const timelineData = [
  { year: '2007', text: '列入莆田市非物质文化遗产名录，正式受到官方保护。' },
  { year: '2014', text: '科研起步，梆鼓咚课程植入莆田学院音乐学院课堂，启动高校传承探索。' },
  { year: '2015', text: '荣获福建省第三届曲艺大赛一等奖；师带徒同台表演获新人奖一等奖、创作奖一等奖。' },
  { year: '2016', text: '音乐权威顶刊CSSCI发表梆鼓咚研究论文，曲艺重大赛事获奖，获政府文艺精品奖励。' },
  { year: '2017', text: '列入福建省非物质文化遗产代表性项目名录；代表福建参加全国曲艺展演。' },
  { year: '2019', text: '非遗申报正式启动，省级曲艺重大赛事再获殊荣，濒危曲种纪录片正式开拍。' },
  { year: '2020', text: '一流课程建设立项，CSSCI非遗论文发表，非遗文创重大项目立项。' },
  { year: '2021', text: '莆田市梆鼓咚传习所正式成立；梆鼓咚正式进入本科人才培养方案，开设专门课程。' },
  { year: '2023', text: '申遗成功！学生苏越与陈吉荣获福建省第五届曲艺大赛新人奖。第五代传承人黄璟将无乐谱传统曲目首次记录为五线谱，推动数字化保存。' },
  { year: '现在', text: '莆田学院音乐学院梆鼓咚课程已有逾百名学生参与；构建大中小幼一体化传承体系。' },
]

// 乐器技术数据
const instrumentsData = [
  { name: '板鼓（梆鼓）', desc: '长约 25 厘米、口径约 5 厘米的竹筒，两端蒙皮制成，演奏时斜背于右肩，以竹签敲击。' },
  { name: '竹板', desc: '两片长约 8 厘米、宽 3 厘米、厚 1 厘米的竹片，夹于左腋下，随演唱节拍合击出声。' },
]

// 演奏技法数据
const techniquesData = [
  { name: '响鼓', sound: '咚咚声', desc: '鼓心正击，发出饱满浑厚的低沉鼓声，用于节拍强拍。' },
  { name: '边鼓', sound: '当当声', desc: '击打鼓边，发出清脆金属质感的音色，用于弱拍装饰。' },
  { name: '点鼓', sound: '嘟嘟声', desc: '轻触鼓面，发出短促点状音效，用于节奏细化与装饰。' },
  { name: '闷鼓', sound: '口扑声', desc: '以掌压住鼓面击打，制造闷哑音色，增加音乐层次感。' },
]

// 基本信息数据
const basicInfoData = [
  { label: '别名', value: '板鼓咚 · 乞丐歌 · 俚歌梆鼓' },
  { label: '起源时代', value: '宋代，盛行于清代' },
  { label: '流行地域', value: '福建莆田、仙游等兴化方言地区' },
  { label: '演唱语言', value: '莆田方言（兴化语）' },
  { label: '保护级别', value: '国家级非物质文化遗产（2023年申遗成功）' },
  { label: '传统曲目', value: '保留 70 余个' },
]

function HeritagePage() {
  return (
    <>
      {/* 页头 Banner */}
      <div className="heritage-banner">
        <img src={IMG.hero3} alt="梆鼓咚非遗介绍" className="heritage-banner-img" />
        <div className="heritage-banner-overlay" />
        <div className="heritage-banner-content">
          <div className="heritage-banner-tag">国家级非物质文化遗产</div>
          <h1 className="heritage-banner-title">梆鼓咚</h1>
          <p className="heritage-banner-sub">俚歌梆鼓 · 源于宋代 · 千年传承</p>
        </div>
      </div>

      <div className="heritage-body">
        {/* 基本信息卡片 */}
        <div className="heritage-info-grid">
          {basicInfoData.map((item) => (
            <div key={item.label} className="heritage-info-item">
              <span className="heritage-info-label">{item.label}</span>
              <span className="heritage-info-value">{item.value}</span>
            </div>
          ))}
        </div>

        {/* 历史渊源 */}
        <section className="heritage-section">
          <h2 className="heritage-section-title">
            <span className="heritage-section-icon">◈</span> 历史渊源
          </h2>
          <div className="heritage-section-body">
            <p>梆鼓咚源于宋代，盛行于清代，迄今已有逾千年历史，是福建莆田、仙游等兴化方言地区独有的民间曲艺形式。</p>
            <p>民间传说，宋代水利名人钱四娘在莆田修筑木兰陂期间，百姓以竹筒装铜钱相助，事后将竹筒制成打击乐器，配上传唱的歌谣，逐渐演变为梆鼓咚。民谚"抓也十八，捧也十八"即由此而来，广泛流传于民间。</p>
            <p>梆鼓咚最初由街头艺人以莆田方言单人演唱，后逐步发展为对唱、群唱、坐唱等多种形式，并可配以小型乐队伴奏。语言通俗易懂的"俗唱"版本尤为广泛流传。</p>
          </div>
        </section>

        {/* 乐器构成 */}
        <section className="heritage-section">
          <h2 className="heritage-section-title">
            <span className="heritage-section-icon">◈</span> 乐器构成
          </h2>
          <div className="heritage-instruments">
            {instrumentsData.map((inst) => (
              <div key={inst.name} className="heritage-instrument-card">
                <div className="heritage-instrument-name">{inst.name}</div>
                <p>{inst.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 演奏技法 */}
        <section className="heritage-section">
          <h2 className="heritage-section-title">
            <span className="heritage-section-icon">◈</span> 四种演奏技法
          </h2>
          <div className="heritage-techniques">
            {techniquesData.map((t) => (
              <div key={t.name} className="heritage-technique-card">
                <div className="heritage-technique-name">{t.name}</div>
                <div className="heritage-technique-sound">"{t.sound}"</div>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 演唱形式 */}
        <section className="heritage-section">
          <h2 className="heritage-section-title">
            <span className="heritage-section-icon">◈</span> 演唱形式
          </h2>
          <div className="heritage-section-body">
            <p>梆鼓咚由最初的街头单人演唱，逐步发展出多种表演形式：</p>
            <ul className="heritage-list">
              <li><strong>单人演唱：</strong>传统形式，演唱者自持板鼓与竹板，边击边唱。</li>
              <li><strong>对唱：</strong>两人一问一答，通常以男女声配合，情趣生动。</li>
              <li><strong>群唱：</strong>多人合唱，多用于节庆、庙会等集体场合。</li>
              <li><strong>坐唱：</strong>演唱者落座，配以小型器乐组合，适合室内堂会演出。</li>
            </ul>
            <p>曲目语言分为"雅唱"与"俗唱"两类，俗唱语言通俗，贴近百姓生活，流传最广。</p>
          </div>
        </section>

        {/* 保护传承 */}
        <section className="heritage-section">
          <h2 className="heritage-section-title">
            <span className="heritage-section-icon">◈</span> 保护与传承
          </h2>
          <div className="heritage-timeline">
            {timelineData.map((item) => (
              <div key={item.year} className="heritage-timeline-item">
                <div className="heritage-timeline-year">{item.year}</div>
                <div className="heritage-timeline-text">{item.text}</div>
              </div>
            ))}
          </div>
          <p className="heritage-endangered-note">
            ⚑ 梆鼓咚曾是<strong>福建省八大濒危曲种之一</strong>，2023年申遗成功，传承保护工作持续推进。
          </p>
        </section>

        {/* 底部跳转 */}
        <div className="heritage-footer-nav">
          <a href="#/inheritors" className="btn-primary-hero">认识传承人 →</a>
          <a href="#/course" className="btn-outline-hero">开始学习课程 →</a>
          <a href="#/activities" className="btn-outline-hero">参与近期活动 →</a>
        </div>
      </div>
    </>
  )
}

export default HeritagePage
