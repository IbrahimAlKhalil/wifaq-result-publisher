---
### Do not use this code in production, this repository here is only for reference.
---

## History

Befaq (Bangladesh Qawmi Madrasa Education Board) used to publish their annual exam result online. The website could not handle more than 500 concurrent users and always went down as soon as they published the result. The problem was the poorly designed database. I fixed these issues by copying the exam result data to a MongoDB database and re-creating the API using Node.js. This software here was used to copy the exam results.

## Installation

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
