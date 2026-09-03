# ImobPrime - Site Imobiliário

## 📌 Resumo do Projeto

Site imobiliário profissional com painel administrativo completo, desenvolvido para a conta GitHub `marcostheangels`.

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
├── index.html          # Site principal
├── admin.html         # Painel administrativo
├── css/
│   ├── styles.css     # Estilos do site principal
│   ├── themes.css     # Temas (Moderno, Clássico, Luxo)
│   └── admin.css      # Estilos do painel admin
├── js/
│   ├── data.js        # Dados dos imóveis
│   ├── main.js        # Lógica do site principal
│   └── admin.js       # Lógica do painel admin
└── images/            # Imagens SVG dos ícones
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

---

## 🎛️ Painel Administrativo (Admin)

### Acessar
- URL: `https://marcostheangels.github.io/imoveis-html/admin.html`
- Ou clique no ícone ⚙️ no site principal

### Funcionalidades

| Seção | O que faz |
|-------|-----------|
| **Dashboard** | Visão geral com estatísticas e gráficos |
| **Imóveis** | Listar, editar, excluir, visualizar |
| **Adicionar Imóvel** | Cadastrar novo imóvel com todos os dados |
| **Upload de Fotos** | Sistema de upload com drag & drop |
| **Depoimentos** | Gerenciar avaliações dos clientes |
| **Mensagens** | Ver mensagens do formulário de contato |
| **Configurações** | Dados da empresa, redes sociais, cores |

### Como adicionar/edtar imóvel
1. Menu → **Adicionar Imóvel**
2. Preencher: título, tipo, finalidade, preço, quartos, banheiros, garagens, área
3. Localização e endereço
4. Descrição detalhada
5. Características (checkboxes)
6. Imagens (URLs ou upload)
7. Marcar como destaque (opcional)
8. Salvar

### Backup dos dados
- **Exportar Dados**: Baixa JSON com tudo
- **Importar Dados**: Restaura de um backup

⚠️ **Importante**: Dados salvos no navegador (localStorage). Limpar cache apaga!

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

---

## 📝 Observações Técnicas

### Sincronização
- Admin salva dados no `localStorage` com chave `admin_properties`, `admin_testimonials`, etc.
- Site principal lê esses dados via `localStorage`
- Verificação automática a cada 2 segundos por mudanças

### Imagens
- Usa URLs do Unsplash como padrão
- Admin permite upload de imagens próprias (converte para Base64)
- Limite: 5MB por imagem

### Depoimentos
- Carregados do `localStorage` no admin
- Exibidos na seção "O que nossos clientes dizem" do site

---

## 🔄 Para Atualizar o Código

1. Edite os arquivos localmente
2. Commit e push:
```bash
git add -A
git commit -m "descrição da mudança"
git push origin master
```

---

## 📧 Contato do Desenvolvedor

Desenvolvido com assistance via OpenCode.

---

*Última atualização: 2026*
