import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ACCENT = '#4361ee'

function useTheme() {
  const [dark, setDark] = useState(false)
  return { dark, toggle: () => setDark(d => !d) }
}

function Btn({ onClick, children, primary, dark }: { onClick?: () => void, children: React.ReactNode, primary?: boolean, dark: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '10px 18px',
        fontSize: 13,
        fontWeight: 600,
        borderRadius: 8,
        border: primary ? 'none' : `1px solid ${dark ? '#ffffff18' : '#00000018'}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        background: primary
          ? hov ? ACCENT + 'dd' : ACCENT
          : hov ? (dark ? '#ffffff10' : '#00000008') : 'transparent',
        color: primary ? '#fff' : dark ? '#cdd5e0' : '#374151',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: primary && hov ? '0 4px 16px rgba(67,97,238,0.4)' : 'none',
        whiteSpace: 'nowrap',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {children}
    </button>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  const { dark, toggle } = useTheme()

  const bg = dark ? '#09090f' : '#ffffff'
  const bg2 = dark ? '#0e0e18' : '#f8f9fc'
  const border = dark ? '#ffffff0f' : '#0000000f'
  const text = dark ? '#e8edf5' : '#0f172a'
  const muted = dark ? '#4a5568' : '#64748b'
  const card = dark ? '#0e0e18' : '#ffffff'
  const cardBorder = dark ? '#ffffff0d' : '#e2e8f0'

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: bg, color: text, overflowX: 'hidden', transition: 'background 0.3s, color 0.3s' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `1px solid ${border}`, position: 'sticky', top: 0, background: dark ? 'rgba(9,9,15,0.93)' : 'rgba(255,255,255,0.93)', backdropFilter: 'blur(20px)', zIndex: 100 }}>
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Doc<span style={{ color: ACCENT }}>Alert</span>
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={toggle} style={{ background: 'none', border: `1px solid ${border}`, borderRadius: 8, padding: '7px 10px', cursor: 'pointer', color: muted, fontSize: 16 }}>
            {dark ? '☀️' : '🌙'}
          </button>
          <Btn dark={dark} onClick={() => navigate('/login')}>Entrar</Btn>
          <Btn dark={dark} onClick={() => navigate('/login')} primary>Comecar</Btn>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '64px 20px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: `1px solid ${dark ? '#22c55e22' : '#22c55e33'}`, background: dark ? '#22c55e0a' : '#f0fdf4', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, background: '#22c55e', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #22c55e' }} />
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>4.847 documentos monitorados agora</span>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: 18 }}>
          Para quem ja esqueceu e pagou caro
        </p>

        <h1 style={{ fontSize: 'clamp(36px, 8vw, 64px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 20, color: dark ? '#f1f5fd' : '#0f172a' }}>
          Seus documentos vencem.<br />
          <span style={{ color: ACCENT }}>A gente avisa antes.</span>
        </h1>

        <p style={{ fontSize: 16, color: muted, lineHeight: 1.75, maxWidth: 480, margin: '0 auto 36px' }}>
          CNH, CRLV, passaporte, IPVA e mais. Alertas por email e WhatsApp antes de vencer.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <Btn dark={dark} onClick={() => navigate('/login')} primary>Proteger meus documentos gratis</Btn>
          <Btn dark={dark}>Ver como funciona</Btn>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {['Sem cartao de credito', 'Gratis para comecar', 'Cancele quando quiser'].map(t => (
            <span key={t} style={{ fontSize: 13, color: muted, display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#22c55e', fontWeight: 700 }}>✓</span> {t}
            </span>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <div style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, background: bg2, padding: '14px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, flexWrap: 'wrap', textAlign: 'center' }}>
          <span style={{ fontSize: 13, color: muted }}>Confiado por pessoas em</span>
          {['Sao Paulo', 'Rio de Janeiro', 'Curitiba', 'Fortaleza'].map((c, i) => (
            <span key={c} style={{ fontSize: 13, color: muted }}>
              <span style={{ color: text, fontWeight: 600 }}>{c}</span>{i < 3 ? ' ·' : ''}
            </span>
          ))}
          <span style={{ fontSize: 13, color: muted }}>e mais 180 cidades</span>
        </div>
      </div>

      {/* STATS */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '48px 20px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
        {[
          { num: '47.3 mi', desc: 'CNHs vencem por ano no Brasil' },
          { num: 'R$ 293', desc: 'de multa por CNH vencida' },
          { num: '8 min', desc: 'media para levar uma multa por CRLV' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '0 12px', borderRight: i < 2 ? `1px solid ${border}` : 'none' }}>
            <div style={{ fontSize: 'clamp(24px, 5vw, 48px)', fontWeight: 900, color: ACCENT, letterSpacing: '-1px', marginBottom: 6 }}>{s.num}</div>
            <div style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ background: bg2, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, padding: '64px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ marginBottom: 40, textAlign: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: 'uppercase' as const }}>Como funciona</span>
            <h2 style={{ fontSize: 'clamp(28px, 6vw, 42px)', fontWeight: 800, letterSpacing: '-1.5px', margin: '10px 0 0', color: dark ? '#f1f5fd' : '#0f172a', lineHeight: 1.1 }}>
              Tres passos.<br />Trinta segundos.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            {[
              { n: '01', icon: '📄', title: 'Cadastre seus documentos', desc: 'Informe o tipo e a data de vencimento. So isso.' },
              { n: '02', icon: '🔔', title: 'Receba alertas certeiros', desc: 'Avisamos 90, 30 e 7 dias antes. Por email e WhatsApp.' },
              { n: '03', icon: '✅', title: 'Renove com um guia', desc: 'Passo a passo especifico com links e custos.' },
            ].map(s => (
              <div key={s.n} style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: '24px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 1, marginBottom: 16 }}>{s.n}</div>
                <div style={{ fontSize: 26, marginBottom: 12 }}>{s.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: dark ? '#e8edf5' : '#0f172a' }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CUSTO */}
      <section style={{ padding: '64px 20px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', letterSpacing: 2, textTransform: 'uppercase' as const }}>Quanto custa esquecer</span>
            <h2 style={{ fontSize: 'clamp(28px, 6vw, 38px)', fontWeight: 800, letterSpacing: '-1.5px', margin: '10px 0 0', color: dark ? '#f1f5fd' : '#0f172a', lineHeight: 1.1 }}>
              O preco do descuido
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { doc: 'CNH vencida', multa: 'R$ 293,47', extra: '5 pontos + risco de apreensao', cor: '#ef4444' },
              { doc: 'CRLV atrasado', multa: 'R$ 293,47', extra: 'Veiculo pode ser apreendido', cor: '#f97316' },
              { doc: 'Passaporte vencido', multa: 'R$ 5.000+', extra: 'Viagem cancelada + prejuizo total', cor: '#ef4444' },
              { doc: 'IPVA atrasado', multa: '0,33%/dia', extra: 'Juros diarios + multa + divida ativa', cor: '#f97316' },
            ].map(item => (
              <div key={item.doc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: card, border: `1px solid ${cardBorder}`, borderLeft: `3px solid ${item.cor}`, borderRadius: 10, padding: '16px', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, color: dark ? '#e8edf5' : '#0f172a' }}>{item.doc}</div>
                  <div style={{ fontSize: 12, color: muted }}>{item.extra}</div>
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, color: item.cor }}>{item.multa}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '14px 16px', background: dark ? '#4361ee10' : '#eff3ff', border: `1px solid ${dark ? '#4361ee30' : '#c7d7fd'}`, borderRadius: 10, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <span style={{ fontSize: 13, color: dark ? '#a5b4fc' : '#4338ca' }}>O DocAlert Individual custa R$ 9,90 por mes. Menos que 4% do valor da multa mais barata.</span>
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ background: bg2, borderTop: `1px solid ${border}`, padding: '64px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ marginBottom: 36, textAlign: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: 'uppercase' as const }}>Depoimentos</span>
            <h2 style={{ fontSize: 'clamp(28px, 6vw, 38px)', fontWeight: 800, letterSpacing: '-1.5px', margin: '10px 0 8px', color: dark ? '#f1f5fd' : '#0f172a' }}>Quem usa, nao volta atras</h2>
            <div style={{ fontSize: 20, fontWeight: 900, color: ACCENT }}>R$ 847.293</div>
            <div style={{ fontSize: 12, color: muted }}>em multas evitadas pelos nossos usuarios</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {[
              { nome: 'Mariana S.', cidade: 'Sao Paulo, SP', texto: 'Quase perdi minha viagem de lua de mel porque meu passaporte venceu. Hoje nao vivo sem o DocAlert.', economia: 'R$ 4.200', label: 'em passagens que nao perdi' },
              { nome: 'Ricardo P.', cidade: 'Curitiba, PR', texto: 'Gerencio os documentos de toda a familia. Economizei tempo e dinheiro. Vale cada centavo.', economia: 'R$ 586', label: 'em multas evitadas' },
              { nome: 'Camila F.', cidade: 'Belo Horizonte, MG', texto: 'Sou MEI e tenho varios prazos. O DocAlert virou parte da minha rotina de negocios.', economia: 'R$ 263', label: 'por mes economizados' },
              { nome: 'Bruno M.', cidade: 'Rio de Janeiro, RJ', texto: 'Paguei multa por CNH vencida. Foi a ultima vez. Semanas depois conheci o DocAlert.', economia: 'R$ 293', label: 'em multa que nao pago mais' },
            ].map(d => (
              <div key={d.nome} style={{ background: card, border: `1px solid ${cardBorder}`, borderRadius: 12, padding: '20px' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f59e0b', fontSize: 13 }}>&#9733;</span>)}
                </div>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.65, marginBottom: 16, fontStyle: 'italic' }}>"{d.texto}"</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: dark ? '#e8edf5' : '#0f172a' }}>{d.nome}</div>
                    <div style={{ fontSize: 11, color: muted }}>{d.cidade}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: 18, color: '#22c55e' }}>{d.economia}</div>
                    <div style={{ fontSize: 11, color: muted }}>{d.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEGURANCA */}
      <section style={{ padding: '48px 20px', borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 28, color: dark ? '#e8edf5' : '#0f172a' }}>Seus dados estao seguros</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', label: 'Criptografia SSL' },
              { icon: '🇧🇷', label: 'Em conformidade com LGPD' },
              { icon: '🏦', label: 'Dados no Brasil' },
              { icon: '🔐', label: 'Nao vendemos seus dados' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontSize: 13, color: muted, fontWeight: 500 }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRECOS */}
      <section style={{ background: bg2, borderTop: `1px solid ${border}`, padding: '64px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: 2, textTransform: 'uppercase' as const }}>Precos</span>
            <h2 style={{ fontSize: 'clamp(28px, 6vw, 38px)', fontWeight: 800, letterSpacing: '-1.5px', margin: '10px 0 8px', color: dark ? '#f1f5fd' : '#0f172a' }}>Preco justo. Sem surpresas.</h2>
            <p style={{ fontSize: 14, color: muted }}>Comece de graca. Faca upgrade so quando precisar.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { nome: 'Gratuito', preco: 'R$ 0', periodo: 'para sempre', features: ['1 documento monitorado', 'Alertas por email', 'Guia basico de renovacao'], destaque: false, cta: 'Comecar gratis' },
              { nome: 'Individual', preco: 'R$ 9,90', periodo: '/mes', features: ['Documentos ilimitados', 'Alertas por WhatsApp', 'Guia completo + calculadora', 'Historico e relatorios'], destaque: true, cta: 'Assinar agora' },
              { nome: 'Familiar', preco: 'R$ 19,90', periodo: '/mes', features: ['Tudo do Individual', 'Ate 5 membros da familia', 'Painel compartilhado', 'Suporte prioritario'], destaque: false, cta: 'Assinar agora' },
            ].map(plano => (
              <div key={plano.nome} style={{ background: plano.destaque ? (dark ? '#0e1a35' : '#eff3ff') : card, border: `1px solid ${plano.destaque ? (dark ? '#4361ee40' : '#c7d7fd') : cardBorder}`, borderRadius: 14, padding: '24px 20px', position: 'relative', textAlign: 'left' }}>
                {plano.destaque && (
                  <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: ACCENT, color: '#fff', borderRadius: 100, padding: '3px 14px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    MAIS POPULAR
                  </div>
                )}
                <p style={{ fontSize: 13, color: muted, marginBottom: 6 }}>{plano.nome}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 18 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: dark ? '#f1f5fd' : '#0f172a' }}>{plano.preco}</span>
                  <span style={{ fontSize: 13, color: muted }}>{plano.periodo}</span>
                </div>
                <div style={{ borderTop: `1px solid ${border}`, marginBottom: 16 }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plano.features.map(f => (
                    <li key={f} style={{ fontSize: 13, color: muted, display: 'flex', gap: 8 }}>
                      <span style={{ color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>&#10003;</span>{f}
                    </li>
                  ))}
                </ul>
                <Btn dark={dark} onClick={() => navigate('/login')} primary={plano.destaque}>{plano.cta}</Btn>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', fontSize: 13, color: muted, marginTop: 20 }}>
            Garantia de 7 dias. Se nao gostar, devolvemos sem perguntas.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '64px 20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: dark ? '#ef444415' : '#fef2f2', border: `1px solid ${dark ? '#ef444430' : '#fecaca'}`, borderRadius: 100, padding: '5px 14px', marginBottom: 24 }}>
          <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>Cada dia sem o DocAlert e um dia de risco</span>
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 6vw, 44px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 14, lineHeight: 1.05, color: dark ? '#f1f5fd' : '#0f172a' }}>
          Nao espere levar uma multa para se organizar
        </h2>
        <p style={{ fontSize: 15, color: muted, marginBottom: 32, lineHeight: 1.65 }}>
          Crie sua conta em 30 segundos. E completamente gratis para comecar.
        </p>
        <Btn dark={dark} onClick={() => navigate('/login')} primary>Criar conta gratuita agora</Btn>
        <p style={{ marginTop: 14, fontSize: 12, color: muted }}>Sem cartao de credito. Cancel quando quiser.</p>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${border}`, padding: '24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 15 }}>Doc<span style={{ color: ACCENT }}>Alert</span></span>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Termos', 'Privacidade', 'Contato'].map(l => (
            <a key={l} href="#" style={{ color: muted, textDecoration: 'none', fontSize: 13 }}>{l}</a>
          ))}
        </div>
        <span style={{ fontSize: 12, color: muted }}>2026 DocAlert</span>
      </footer>

    </div>
  )
}
