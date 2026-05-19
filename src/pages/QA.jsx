/**
 * AI智能助手页面
 */
import { useCallback } from 'react'
import { defaultQuestion } from './data'

function QAPage({
  question = '',
  setQuestion,
  answer = '',
  askedQuestion = '',
  error = '',
  isLoading = false,
  handleAsk
}) {
  // 优化：记忆化快捷问题处理器
  const handleQuickQuestion = useCallback((q) => {
    setQuestion(q)
  }, [setQuestion])

  const handleInputChange = useCallback((e) => {
    setQuestion(e.target.value)
  }, [setQuestion])

  return (
    <div className="ai-chat-page">
      <div className="ai-chat-header">
        <div className="ai-chat-icon" role="img" aria-label="机器人">🤖</div>
        <div>
          <p className="ai-chat-header-title">非遗智能助手</p>
          <p className="ai-chat-header-sub">探索非遗知识，传承文化瑰宝</p>
        </div>
      </div>
      
      <div className="ai-chat-body">
        <div className="ai-message-bot">
          你好！很高兴为您服务！我是一个专业的非物质文化遗产智能助手，可以帮助您了解中国各地的非遗项目、传承人、活动和课程。
          <div className="ai-chip-row" style={{ marginTop: 12 }}>
            <button 
              className="ai-chip" 
              type="button" 
              onClick={() => handleQuickQuestion(defaultQuestion)}
            >
              适合学习年龄
            </button>
            <button 
              className="ai-chip" 
              type="button" 
              onClick={() => handleQuickQuestion('有哪些著名的刺绣类非遗？')}
            >
              著名刺绣非遗
            </button>
            <button 
              className="ai-chip" 
              type="button" 
              onClick={() => handleQuickQuestion('梆鼓咚可以和文创集市怎么联动？')}
            >
              非遗与文创联动
            </button>
          </div>
        </div>
        
        {answer && answer !== '这里会显示课程答疑、术语解释、学习建议和传播方案。' && (
          <>
            <div className="ai-message-user">{askedQuestion}</div>
            <div className="ai-message-bot">{answer}</div>
          </>
        )}
        
        {error ? <p className="ai-error" role="alert">{error}</p> : null}
      </div>
      
      <form onSubmit={handleAsk} style={{ marginTop: 12 }}>
        <div className="ai-input-row">
          <input
            type="text"
            value={question}
            onChange={handleInputChange}
            placeholder="请问有什么可以帮您的吗？"
            aria-label="输入问题"
            disabled={isLoading}
          />
          <button 
            className="ai-send-btn" 
            type="submit" 
            disabled={isLoading || !question.trim()}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <span 
                  className="spinner"
                  style={{
                    display: 'inline-block',
                    width: '14px',
                    height: '14px',
                    marginRight: '6px',
                    border: '2px solid transparent',
                    borderTopColor: 'currentColor',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    verticalAlign: 'middle'
                  }} 
                />
                生成中…
              </>
            ) : '发送'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default QAPage
