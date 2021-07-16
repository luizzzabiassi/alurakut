import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(propriedades){
  return(
    <Box as='aside'>
      <img src={`https://github.com/${propriedades.githubUser}.png`} style={{borderRadius: '8px'}}></img>
      <hr/>

      <p>
        <a className='boxLink' href={`https://github.com/${propriedades.githubUser}`}>
          @{propriedades.githubUser}
        </a>
      </p>
      <hr/>
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return(
    <ProfileRelationsBoxWrapper>
      <h2 className='smallTitle'>
        {propriedades.title} ({propriedades.items.length})
      </h2>

      <ul>
        {/*seguidores.map((itemAtual) => {
          return(
            <li key={itemAtual}>
              <a href={`https://github.com/${itemAtual}.png`}>
                <img src={itemAtual.image} />
                <span>{itemAtual.title}</span>
              </a>
            </li>
          )
        })*/}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(){
  const githubUser = 'luizzzabiassi';
  const [comunidades, setComunidades] = React.useState([]);

  // const comunidades = comunidades[0]
  // const alteradorDeComunidades/setComunidades = comunidades[1]
  // const comunidades = ['Alurakut'];

  // console.log(comunidades[0]);

  const pessoasFavoritas = [
    'juunegreiros', 
    'omariosouto', 
    'peas', 
    'rafaballerini', 
    'cardosovanessa',
    'felipefialho'
  ]

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://api.github.com/users/luizzzabiassi/followers`)
    .then(respServidor => respServidor.json())
    .then(respCompleta => setSeguidores(respCompleta))

    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': '47c2a8b04c63ca3323bbfb658c0282',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        'query': `query {
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
          }
        }`
      })
    })
    .then(resp => resp.json())
    .then(respCompleta => {
      const comunidadesDato = respCompleta.data.allCommunities;
      console.log(comunidadesDato);
      setComunidades(comunidadesDato)
    })
  }, [])

  return(
    <>
      <AlurakutMenu githubUser={githubUser}/>
      <MainGrid>
        <div className='profileArea' style={{gridArea: 'profileArea'}}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className='welcomeArea' style={{gridArea: 'welcomeArea'}}>
          <Box>
            <h1 className='title'>
              Bem-Vindo(a)
            </h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className='subTitle'>O que você deseja fazer?</h2>
            <form onSubmit={function handleCriaComunidade(e){
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              console.log('Campo: ', dadosDoForm.get('title'));
              console.log('Campo: ', dadosDoForm.get('image'));

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser
              }

              fetch('/api/communities', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade)
              })
              .then(async res => {
                const dados = await res.json();
                console.log(dados.regCriado);

                const comunidade = dados.regCriado;
                const comunidadesAtualizadas = [...comunidades, comunidade];
                
                setComunidades(comunidadesAtualizadas)
              })
            }}>
              <div>
                <input placeholder='Qual vai ser o nome da sua comunidade?' name='title' aria-label='Qual vai ser o nome da sua comunidade?' type='text'/>
              </div>

              <div>
                <input placeholder='Coloque uma URL para usarmos de capa.' name='image' aria-label='Coloque uma URL para usarmos de capa.'/>
              </div>

              <button>Criar Comunidade</button>
            </form>
          </Box>
        </div>

        <div className='profileRelationsArea' style={{gridArea: 'profileRelationsArea'}}>
          <ProfileRelationsBox title='Seguidores' items={seguidores} />
          
          <ProfileRelationsBoxWrapper>
            <h2 className='smallTitle'>
              Comunidades ({comunidades.length})
            </h2>

            <ul>
              {comunidades.map(itemAtual => {
                return(
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className='smallTitle'>
              Pessoas da Comunidade ({pessoasFavoritas.length})
            </h2>
            
            <ul>
              {pessoasFavoritas.map(itemAtual => {
                return(
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} >
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  )
}