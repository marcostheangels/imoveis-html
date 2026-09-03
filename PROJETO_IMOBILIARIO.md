# Neo Imóveis e Negócios - Site Imobiliário

## 📌 Resumo do Projeto

Site imobiliário profissional com painel administrativo completo e deploy automático no GitHub, desenvolvido para a conta GitHub `marcostheangels`.

**Repositório:** https://github.com/marcostheangels/imoveis-html

---

## 🌐 Links Online

| Página | URL |
|--------|-----|
| **Site Principal** | https://marcostheangels.github.io/imoveis-html/ |
| **Painel Admin** | https://marcostheangels.github.io/imoveis-html/admin.html |

---

## 📁 Estrutura de Arquivos

```
site imobiliario/
├── index.html              # Site principal
├── admin.html             # Painel administrativo
├── PROJETO_IMOBILIARIO.md # Documentação do projeto
├── .env.example           # Modelo de configurações (não comitar!)
├── .gitignore            # Arquivos ignorados pelo Git
├── css/
│   ├── styles.css        # Estilos do site principal
│   ├── themes.css        # Temas (Moderno, Clássico, Luxo)
│   └── admin.css         # Estilos do painel admin
├── js/
│   ├── data.js           # Dados dos imóveis padrão
│   ├── main.js           # Lógica do site principal
│   └── admin.js          # Lógica do painel admin
└── images/               # Imagens SVG dos ícones
```

---

## 🎯 Funcionalidades do Site

- ✅ Filtros (tipo, finalidade, preço, quartos, ordenação)
- ✅ Busca por texto
- ✅ Favoritos (salvos no navegador)
- ✅ Comparação de até 3 imóveis
- ✅ Modal com galeria de fotos
- ✅ Simulador de financiamento
- ✅ Seção "Como Funciona"
- ✅ Depoimentos de clientes
- ✅ Formulário de contato
- ✅ Botão WhatsApp flutuante
- ✅ Botão voltar ao topo
- ✅ Menu responsivo para mobile
- ✅ 3 temas visuais (Moderno, Clássico, Luxo)
- ✅ Contador de visualizações real (localStorage)

---

## 🎛️ Painel Administrativo (Admin)

### Acessar
- URL: `https://marcostheangels.github.io/imoveis-html/admin.html`
- Ou clique no ícone ⚙️ no site principal

### Funcionalidades

| Seção | O que faz |
|-------|-----------|
| **Dashboard** | Visão geral com estatísticas, gráficos e contador de visualizações |
| **Imóveis** | Listar, editar, excluir, visualizar (modal interno) |
| **Adicionar Imóvel** | Cadastrar novo imóvel com upload simplificado de fotos |
| **Upload de Fotos** | Sistema de upload com galeria para gerenciar imagens |
| **Depoimentos** | Gerenciar avaliações dos clientes |
| **Mensagens** | Ver mensagens do formulário de contato |
| **Configurações** | Dados da empresa, redes sociais, cores, deploy GitHub |

### Como adicionar/editar imóvel
1. Menu → **Adicionar Imóvel**
2. Preencher: título, tipo, finalidade, preço, quartos, banheiros, garagens, área
3. Localização e endereço
4. Descrição detalhada
5. Características (checkboxes)
6. **Adicionar Fotos** - Clique no botão para selecionar do computador (novo sistema simplificado!)
7. Marcar como destaque (opcional)
8. Salvar

### Sistema de Imagens (NOVO!)
- Clique em "Adicionar Fotos" para selecionar do seu computador
- Visualização em grid com preview
- Remover fotos passando o mouse e clicando no X
- Limite: 5MB por imagem
- Imagens são convertidas para Base64 e salvas no localStorage

### Upload de Fotos
- Upload via drag & drop ou clique
- Galeria para gerenciar imagens salvas
- Botão "Copiar URL" para usar em outros imóveis

### Dashboard - Estatísticas
- **Total de Imóveis**: Contagem dos imóveis cadastrados
- **Visualizações**: Contador real de acessos ao site (localStorage)
- **Favoritos**: Quantidade de imóveis favoritados
- **Mensagens**: Quantidade de mensagens recebidas

---

## 🚀 Deploy Automático no GitHub

### Configurar Token GitHub
1. Abra o admin → **Configurações**
2. Clique em **"Configurar Token GitHub"**
3. Cole seu Personal Access Token (PAT)
4. O token fica salvo no navegador (localStorage)

### Como criar o Token
1. GitHub → Settings → Developer settings
2. Personal access tokens → Generate new token
3. Selecione escopo **`repo`**
4. Copie e cole no admin

### Funcionamento
- Após configurar o token, toda vez que você salvar algo no admin, **publica automaticamente no GitHub**
- Alternativamente, use o botão **"Publicar Agora"** para forçar o deploy
- Status mostra se o auto-deploy está ativo

⚠️ **Importante**: O token fica no localStorage do seu navegador, não no código.

---

## ⚙️ Configurações do GitHub Pages

1. GitHub → Repositório → **Settings**
2. Menu esquerdo → **Pages**
3. Source: **Deploy from a branch** → **master** → **/ (root)**
4. Save
5. Aguardar ~2 minutos

---

## 🛠️ Tecnologias Usadas

- HTML5
- CSS3 (com variáveis CSS e temas)
- JavaScript Vanilla
- Font Awesome 6.4 (ícones)
- Google Fonts (Montserrat, Playfair Display, Lora)
- LocalStorage (persistência de dados)
- GitHub Pages (hospedagem)
- GitHub API (deploy automático)

---

## 📝 Observações Técnicas

### Sincronização
- Admin salva dados no `localStorage` com chaves:
  - `admin_properties` - Imóveis
  - `admin_testimonials` - Depoimentos
  - `admin_messages` - Mensagens
  - `admin_settings` - Configurações
  - `uploaded_images` - Imagens upload
  - `site_views` - Contador de visualizações
  - `gh_token_encrypted` - Token GitHub (criptografado)
- Site principal lê esses dados via `localStorage`
- Verificação automática a cada 2 segundos por mudanças

### Imagens
- Usa URLs do Unsplash como padrão
- Admin permite upload de imagens próprias (converte para Base64)
- Novo sistema simplificado de upload no formulário de imóveis
- Limite: 5MB por imagem

### Depoimentos
- Carregados do `localStorage` no admin
- Exibidos na seção "O que nossos clientes dizem" do site

### Deploy Automático
- Usa GitHub API REST para fazer commit dos arquivos
- Commits automáticos com mensagem timestampada
- Requer Personal Access Token com escopo `repo`

---

## 🔄 Para Atualizar o Código

### Via Git (localmente)
```bash
git add -A
git commit -m "descrição da mudança"
git push origin master
```

### Via Admin (auto-deploy)
1. Configure o token GitHub nas Configurações
2. Edite o que quiser no admin
3. Clique Salvar
4. O site é publicado automaticamente

---

## 📧 Contato do Desenvolvedor

Desenvolvido com assistance via OpenCode.

---

*Última atualização: 03/09/2026*
