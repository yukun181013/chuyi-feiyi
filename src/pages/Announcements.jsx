/**
 * 公告页面
 */
import { announcements } from './data'

function AnnouncementsPage() {
  return (
    <div className="announcements-page">
      <h2 style={{ marginBottom: 20, fontFamily: 'var(--font-display)' }}>官方公告</h2>
      <div className="notice-list-wrap">
        <ul className="notice-list" role="list">
          {announcements.map((item) => (
            <li key={item.title} className="notice-item">
              <span className="notice-item-title">{item.title}</span>
              <time className="notice-item-date" dateTime={item.date}>{item.date}</time>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AnnouncementsPage
