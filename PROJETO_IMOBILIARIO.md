# 📋 PROJETO IMOBILIÁRIO - MARCOS

## Status Atual
✅ Site criado e publicado no GitHub
✅ 24 imóveis cadastrados com fotos e descrições
✅ 3 temas (Moderno, Clássico, Luxo)
✅ Sistema de favoritos e comparação funcionando
✅ Redes sociais (WhatsApp, Facebook, Instagram)
⚠️ AGUARDANDO: Verificar se fotos estão aparecendo corretamente

---

## 📁 ESTRUTURA DO PROJETO

```
site imobiliario/
├── index.html              (estrutura principal do site)
├── css/
│   ├── styles.css         (estilos gerais)
│   └── themes.css         (temas: moderno, clássico, luxo)
├── js/
│   ├── data.js            (dados dos imóveis - EDITAR AQUI)
│   └── main.js            (lógica JavaScript)
└── images/
    ├── apartamentos/       (imagens SVG placeholder)
    ├── casas/
    ├── comercial/
    ├── terrenos/
    └── logo/
```

---

## 🔗 LINKS IMPORTANTES

- **Site Online:** https://marcostheangels.github.io/imoveis-html/
- **Repositório:** https://github.com/marcostheangels/imoveis-html

---

## 📝 COMO EDITAR

### 1. Adicionar/Editar Imóveis (js/data.js)
```javascript
{
    id: 25,
    title: "Nome do Imóvel",
    type: "apartamento",  // apartamento, casa, comercial, terreno
    purpose: "venda",      // venda ou aluguel
    price: 1500000,
    location: "Bairro, Cidade - UF",
    address: "Rua, Número",
    rooms: 3,
    bathrooms: 2,
    garages: 2,
    area: 120,
    description: "Descrição detalhada do imóvel...",
    features: ["Característica 1", "Característica 2", "Característica 3"],
    images: [
        "https://images.unsplash.com/photo-ID?w=800&q=80",
        "https://images.unsplash.com/photo-ID?w=800&q=80",
        "https://images.unsplash.com/photo-ID?w=800&q=80",
        "https://images.unsplash.com/photo-ID?w=800&q=80"
    ],
    featured: true  // true = aparece como destaque
}
```

### 2. Alterar Redes Sociais (index.html)
Localize a linha ~200 e altere os links:
```html
<a href="https://wa.me/SEU_NUMERO" ...>WhatsApp</a>
<a href="https://facebook.com/SEU_PERFIL" ...>Facebook</a>
<a href="https://instagram.com/SEU_PERFIL" ...>Instagram</a>
```

### 3. Mudar Informações de Contato (index.html)
- Telefone: Linha ~188
- Endereço: Linha ~181
- E-mail: Linha ~195

### 4. Personalizar Temas (css/themes.css)
```css
[data-theme="seu-tema"] {
    --primary: #COR_PRINCIPAL;
    --secondary: #COR_SECUNDARIA;
    --accent: #COR_DESTAQUE;
    --bg: #COR_FUNDO;
    /* ... outras cores */
}
```

### 5. Trocar Fotos dos Imóveis
```javascript
// Buscar foto no Unsplash:
1. Acesse https://unsplash.com
2. Busque "apartamento" ou "house"
3. Clique na foto desejada
4. Copie o link da imagem (ou o ID da foto)
5. Use: "https://images.unsplash.com/photo-ID?w=800&q=80"
```

---

## 🚀 COMANDOS GIT (para atualizar o site)

```bash
# 1. Entre na pasta do projeto
cd "C:\Users\MARCOS\Desktop\site imobiliario"

# 2. Adicionar alterações
git add .

# 3. Fazer commit
git commit -m "Descrição do que foi alterado"

# 4. Enviar para o GitHub
git push
```

---

## 📌 TAREFAS PENDENTES

1. ⚠️ Verificar se fotos estão aparecendo corretamente
2. ⬜ Trocar fotos placeholder por fotos reais dos imóveis
3. ⬜ Personalizar links das redes sociais com dados reais
4. ⬜ Adicionar mais imóveis com fotos próprias
5. ⬜ Adicionar mapa do Google Maps no contato
6. ⬜ Criar formulário de contato funcional (enviar e-mail)

---

## 📞 SUPORTE RÁPIDO

### Problema: Fotos não aparecem
1. Verifique se `data.js` está sendo carregado
2. Verifique se há erro no console (F12)
3. Teste o link da imagem diretamente no navegador

### Problema: Site não atualiza online
1. Aguarde 1-2 minutos após o push
2. Limpe o cache do navegador (Ctrl + F5)
3. Teste em modo anônimo

---

## 💡 DICAS

- Para boas fotos, use imagens com no mínimo 800x600px
- Formato recomendado: JPG ou WebP
- Comprima as fotos para o site carregar mais rápido
- Salve as fotos na pasta `images/` para ter backup local

---

## 📅 Data da última atualização
03/09/2026 - 01:00

## 👤 Proprietário
Marcos - GitHub: marcostheangels
