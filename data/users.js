import bcrypt from 'bcryptjs'

let users = [
  {
    _id: "602e8dd431a3ab15c0dd72b6",
    name: 'Admin User',
    email: 'admin@example.com',
    // tickets: [],
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    projects: ['602e8cc994ed064030fa5633'],
  },
  {
    _id: "602e8dd431a3ab15c0dd72b7",
    name: 'John Doe',
    email: 'john@example.com',
    // tickets: [],
    password: bcrypt.hashSync('123456', 10),
    role: 'project manager',
    projects: ['602df56561fbf21cb0eab995', '602e8cc994ed064030fa5633'],
    subordinates: ["602e8dd431a3ab15c0dd72b8", "602e8dd431a3ab15c0dd72b9"]
  },
  {
    _id: "602e8dd431a3ab15c0dd72b8",
    name: 'Jane Deer',
    email: 'jane@example.com',
    // tickets: ["602da07e54a3274fe0431d9d", "602da0fa54a3274fe0431d9f", "602da11954a3274fe0431da0"],
    password: bcrypt.hashSync('123456', 10),
    role: 'developer',
    projects: ['602df56561fbf21cb0eab995', '602e8cc994ed064030fa5633'],
    supervisors: ["602e8dd431a3ab15c0dd72b7"]
  },
  {
    _id: "602e8dd431a3ab15c0dd72b9",
    name: 'Steve Smith',
    email: 'steve@example.com',
    // tickets: ["602da07e54a3274fe0431d9d", "602da0ad54a3274fe0431d9e"],
    password: bcrypt.hashSync('123456', 10),
    role: 'developer',
    projects: ['602df56561fbf21cb0eab995', '602e8cc994ed064030fa5633'],
    supervisors: ["602e8dd431a3ab15c0dd72b7"]
  },
]

export default users
