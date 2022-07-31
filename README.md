<div align="center">

  <h1>another-chat</h1>
  
  <p>
    yet another realtime chat app
  </p>

[Live Demo](https://another-chat.netlify.app/)

  <br>
</div>

<!-- Table of Contents -->

# Table of Contents

- [About the Project](#about-the-project)
  - [Video Demo](#Video-Demo)
  - [Tech Stack](#tech-stack)
  - [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Run Locally](#run-locally)
- [Roadmap](#roadmap)
- [Contact](#contact)

<!-- About the Project -->

## About the Project

### Video Demo

- [another-chat Demo](https://youtu.be/zchCj-U8j_U)

<!-- TechStack -->

### Tech Stack

  <ul>
    <li>Node.js</li>
    <li>JWT</li>
    <li>MongoDB</li>
    <li>Socket.io</li>
    <li>React</li>
  </ul>

<!-- Env Variables -->

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`clientURL`

`mongodbURI`

`secretOrKey`

<!-- Getting Started -->

## Getting Started

<!-- Prerequisites -->

### Prerequisites

- [Node.js](https://nodejs.org/en)

- Yarn package manager

```bash
 npm install --global yarn
```

<!-- Run Locally -->

### Run Locally

Clone the project

```bash
  git clone https://github.com/zahid47/another-chat.git
```

Go to the server directory

```bash
  cd another-chat/server
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```

Go to the client directory

```bash
  cd another-chat/client
```

update src/config/baseURL.js to match your own URLs

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```

Go to the socket directory

```bash
  cd another-chat/socket
```

Install dependencies

```bash
  yarn install
```

Start the server

```bash
  yarn dev
```

<!-- Roadmap -->

## Roadmap

- [ ] implement end-to-end text-msg encryption
- [ ] make the auto scroll messages better (useRef)

<!-- Contact -->

## Contact

- [email](mailto:epiczahid@gmail.com)
- scarecow#2857 on discord
