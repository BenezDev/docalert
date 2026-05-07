import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Btn({ onClick, children, primary }: { onClick?: () => void, children: React.ReactNode, primary?: boolean }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '13px 26px',
        fontSize: 14,
        fontWeight: 600,
        borderRadius: 10,
        border: primary ? 'none' : '1px solid #1e2535',
        cursor: 'pointer',
        transition: 'all 0.18s ease',
        background: primary ? (hov ? '#1d4ed8' : '#2563eb') : (hov ? '#0d1117' : 'transparent'),
        color: '#fff',
        transform: hov ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: primary && hov ? '0 6px 20px rgba(37,99,235,0.4)' : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

function FeatureCard({ num, icon, title, desc }: { num: string, icon: string, title: string, desc: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#0b0f1a',
        border: `1px solid ${hov ? '#1e3a5f' : '#141824'}`,
        borderRadius: 14,
        padding: '28px 24px',
        transition: 'all 0.18s ease',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hov ? '0 16px 40px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: 1, marginBottom: 18 }}>{num}</div>
      <div style={{ fontSize: 26, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#dde1f0' }}>{title}</h3>
      <p style={{ fontSize: 13, color: '#3a4155', lineHeight: 1.65, margin: 0 }}>{desc}</p>
    </div>
  )
}

function TestimonialCard({ nome, cidade, texto, economia, label }: { nome: string, cidade: string, texto: string, economia: string, label: string }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#0b0f1a',
        border: `1px solid ${hov ? '#1e3a5f' : '#141824'}`,
        borderRadius: 14,
        padding: '24px',
        transition: 'all 0.18s ease',
        transform: hov ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      <div style={{ display: 'flex', gap: 2, marginBottom: 14 }}>
        {[1,2,3,4,5].map(i => <span key={i} style={{ color: '#f59e0b', fontSize: 13 }}>&#9733;</span>)}
      </div>
      <p style={{ fontSize: 14, color: '#4a5270', lineHeight: 1.65, marginBottom: 18, fontStyle: 'italic' }}>"{texto}"</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#dde1f0' }}>{nome}</div>
          <div style={{ fontSize: 11, color: '#242b3a' }}>{cidade}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#22c55e' }}>{economia}</div>
          <div style={{ fontSize: 11, color: '#242b3a' }}>{label}</div>
        </div>
      </div>
    </div>
  )
}

export default function Landing() {
  const navigate = useNavigate()

  const steps = [
    { num: '01', icon: '📄', title: 'Cadastre seus documentos', desc: 'Informe o tipo e a data de vencimento. So isso.' },
    { num: '02', icon: '🔔', title: 'Receba alertas no tempo certo', desc: 'Avisamos 90, 30 e 7 dias antes do vencimento.' },
    { num: '03', icon: '✅', title: 'Renove sem stress', desc: 'Um passo a passo para cada documento, simples e rapido.' },
  ]

  const custos = [
    { doc: 'CNH vencida', desc: 'Multa de R$ 293,47 + 5 pontos na carteira + risco de apreensao' },
    { doc: 'CRLV atrasado', desc: 'Multa de R$ 293,47 + veiculo pode ser apreendido' },
    { doc: 'Passaporte vencido', desc: 'Viagem cancelada + prejuizo medio de R$ 5.000' },
    { doc: 'IPVA atrasado', desc: 'Multa de 0,33% ao dia + juros + pode ir para divida ativa' },
  ]

  const depoimentos = [
    { nome: 'Mariana S.', cidade: 'Sao Paulo, SP', texto: 'Quase perdi uma viagem internacional porque meu passaporte tinha vencido. Nunca mais depois do DocAlert.', economia: 'R$ 3.000', label: 'em prejuizo evitado' },
    { nome: 'Ricardo P.', cidade: 'Pai de familia', texto: 'Gerencio os documentos da minha familia inteira. E simples e me poupa uma dor de cabeca enorme.', economia: 'R$ 586', label: 'em multas evitadas' },
    { nome: 'Camila F.', cidade: 'Empreendedora', texto: 'Como MEI, tenho varios prazos para acompanhar. O DocAlert me avisa de tudo sem eu precisar lembrar.', economia: 'R$ 263', label: 'por mes economizados' },
    { nome: 'Bruno M.', cidade: 'Motorista', texto: 'Paguei multa por CNH vencida no ano passado. Agora tenho o DocAlert e durmo tranquilo.', economia: 'R$ 293', label: 'em multa evitada' },
  ]

  const planos = [
    { nome: 'Gratuito', preco: 'R$ 0', periodo: 'para sempre', features: ['1 documento', 'Alertas por email', 'Guia basico de renovacao'], destaque: false, cta: 'Comecar gratis' },
    { nome: 'Individual', preco: 'R$ 9,90', periodo: '/mes', features: ['Documentos ilimitados', 'Alertas por WhatsApp', 'Guia completo + calculadora', 'Historico completo'], destaque: true, cta: 'Assinar agora' },
    { nome: 'Familiar', preco: 'R$ 19,90', periodo: '/mes', features: ['Tudo do Individual', 'Ate 5 membros da familia', 'Painel compartilhado'], destaque: false, cta: 'Assinar agora' },
  ]

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#080c14', color: '#dde1f0', overflowX: 'hidden' }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 48px', borderBottom: '1px solid #0f1420', position: 'sticky', top: 0, background: 'rgba(8,12,20,0.93)', backdropFilter: 'blur(16px)', zIndex: 100 }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Doc<span style={{ color: '#2563eb' }}>Alert</span>
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <a href="#como-funciona" style={{ color: '#3a4155', textDecoration: 'none', fontSize: 14, padding: '6px 12px', fontWeight: 500 }}>Como funciona</a>
          <a href="#precos" style={{ color: '#3a4155', textDecoration: 'none', fontSize: 14, padding: '6px 12px', fontWeight: 500 }}>Precos</a>
          <div style={{ width: 1, height: 18, background: '#141824', margin: '0 4px' }} />
          <Btn onClick={() => navigate('/login')}>Entrar</Btn>
          <Btn onClick={() => navigate('/login')} primary>Comecar gratis</Btn>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '96px 48px 72px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(34,197,94,0.07)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: 100, padding: '5px 14px', marginBottom: 28 }}>
          <span style={{ width: 7, height: 7, background: '#22c55e', borderRadius: '50%', display: 'inline-block' }} />
          <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 500 }}>+4.200 brasileiros protegidos</span>
        </div>

        <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 18 }}>
          Para quem ja esqueceu e pagou caro
        </p>

        <h1 style={{ fontSize: 60, fontWeight: 800, lineHeight: 1.07, letterSpacing: '-2px', marginBottom: 20, color: '#eef0f8' }}>
          Seus documentos vencem.<br />
          <span style={{ color: '#2563eb' }}>A gente avisa antes.</span>
        </h1>

        <p style={{ fontSize: 17, color: '#3a4155', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 40px' }}>
          Cadastre CNH, CRLV, passaporte e mais. Receba alertas com antecedencia e saiba exatamente o que fazer para renovar.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
          <Btn onClick={() => navigate('/login')} primary>Comecar gratis &#8594;</Btn>
          <Btn>Como funciona?</Btn>
        </div>
        <p style={{ fontSize: 12, color: '#1e2535' }}>Gratis para 1 documento · Individual R$ 9,90/mes · Familiar R$ 19,90/mes</p>
      </section>

      {/* STATS */}
      <section style={{ borderTop: '1px solid #0f1420', borderBottom: '1px solid #0f1420' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '44px 48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {[
            { num: '47 mi', label: 'de CNHs vencem por ano no Brasil' },
            { num: 'R$ 293', label: 'e a multa por dirigir com CNH vencida' },
            { num: '72%', label: 'das pessoas so lembram quando e tarde' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0 24px', borderRight: i < 2 ? '1px solid #0f1420' : 'none' }}>
              <div style={{ fontSize: 42, fontWeight: 800, color: '#2563eb', marginBottom: 6, letterSpacing: '-1px' }}>{stat.num}</div>
              <div style={{ fontSize: 13, color: '#2a3040', lineHeight: 1.5 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ maxWidth: 820, margin: '0 auto', padding: '88px 48px' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>Como funciona</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44, flexWrap: 'wrap', gap: 16 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', margin: 0, lineHeight: 1.1, color: '#eef0f8' }}>
            Simples de usar.<br />Dificil de esquecer.
          </h2>
          <p style={{ fontSize: 14, color: '#2a3040', maxWidth: 260, lineHeight: 1.65, margin: 0 }}>
            Em menos de 2 minutos voce cadastra seus documentos e pronto.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {steps.map(s => <FeatureCard key={s.num} {...s} />)}
        </div>
      </section>

      {/* CUSTO */}
      <section style={{ background: '#060910', borderTop: '1px solid #0f1420', borderBottom: '1px solid #0f1420', padding: '88px 48px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 12, color: '#eef0f8' }}>
            O custo de nao se organizar
          </h2>
          <p style={{ fontSize: 14, color: '#2a3040', marginBottom: 36, lineHeight: 1.6 }}>
            Esquecer a data de vencimento pode sair caro. Literalmente.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
            {custos.map(item => (
              <div key={item.doc} style={{ background: '#080c14', border: '1px solid #141824', borderLeft: '3px solid #ef4444', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, color: '#dde1f0' }}>{item.doc}</div>
                <div style={{ fontSize: 13, color: '#2a3040' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEPOIMENTOS */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '88px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 44, flexWrap: 'wrap', gap: 16 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', margin: 0, color: '#eef0f8' }}>
            Quem usa,<br />recomenda
          </h2>
          <p style={{ fontSize: 13, color: '#2a3040', margin: 0 }}>Historias reais de pessoas que evitaram multas</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {depoimentos.map(d => <TestimonialCard key={d.nome} {...d} />)}
        </div>
      </section>

      {/* PRECOS */}
      <section id="precos" style={{ background: '#060910', borderTop: '1px solid #0f1420', padding: '88px 48px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#2563eb', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>Precos</p>
            <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 10, color: '#eef0f8' }}>Preco justo, sem surpresas</h2>
            <p style={{ fontSize: 14, color: '#2a3040' }}>Comece de graca. Faca upgrade quando precisar de mais.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
            {planos.map(plano => (
              <div key={plano.nome} style={{
                background: plano.destaque ? '#0b1628' : '#080c14',
                border: `1px solid ${plano.destaque ? '#1e3a6e' : '#141824'}`,
                borderRadius: 14, padding: 26, position: 'relative', textAlign: 'left'
              }}>
                {plano.destaque && (
                  <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', borderRadius: 100, padding: '3px 14px', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    RECOMENDADO
                  </div>
                )}
                <p style={{ fontSize: 13, color: '#2a3040', marginBottom: 6 }}>{plano.nome}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 20 }}>
                  <span style={{ fontSize: 34, fontWeight: 800, color: '#eef0f8' }}>{plano.preco}</span>
                  <span style={{ fontSize: 13, color: '#2a3040' }}>{plano.periodo}</span>
                </div>
                <div style={{ borderTop: '1px solid #141824', marginBottom: 18 }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 22px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {plano.features.map(f => (
                    <li key={f} style={{ fontSize: 13, color: '#3a4155', display: 'flex', gap: 8 }}>
                      <span style={{ color: '#22c55e' }}>&#10003;</span>{f}
                    </li>
                  ))}
                </ul>
                <Btn onClick={() => navigate('/login')} primary={plano.destaque}>{plano.cta}</Btn>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{ maxWidth: 580, margin: '0 auto', padding: '88px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 14, lineHeight: 1.1, color: '#eef0f8' }}>
          Nao espere levar uma multa para se organizar
        </h2>
        <p style={{ fontSize: 14, color: '#2a3040', marginBottom: 32, lineHeight: 1.65 }}>
          Crie sua conta em 30 segundos e cadastre seu primeiro documento agora. Gratis, sem cartao de credito.
        </p>
        <Btn onClick={() => navigate('/login')} primary>Criar conta gratuita &#8594;</Btn>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #0f1420', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 15 }}>Doc<span style={{ color: '#2563eb' }}>Alert</span></span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Termos', 'Privacidade', 'Contato'].map(l => (
            <a key={l} href="#" style={{ color: '#1e2535', textDecoration: 'none', fontSize: 13 }}>{l}</a>
          ))}
        </div>
        <span style={{ fontSize: 12, color: '#141824' }}>2026 DocAlert</span>
      </footer>

    </div>
  )
}
