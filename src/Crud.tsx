import {Button, Form} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";
import service from "./service/service";
import 'bootstrap/dist/css/bootstrap.min.css'
import {UserContext} from "./context/UserContext";

interface User {
    id?: number,
    username: string,
    email: string
}

const Stuffs = () => {

    const [users, setUsers] = useState<User[] | []>([])
    const [user, setUser] = useState<User | null>(null)
    const [userUpdate, setUserUpdate] = useState<User | null>(null)

    function postData(userToPost: User) {
        service.post("", userToPost).then(response => {
            setUser(response.data)
        })
    }

    function deleteData(id: number) {
        service.delete(`?id=${id}`).then(response => {
            setUser(response.data)
        })
    }

    function updateData(userToEdit: User) {
        service.put("", userToEdit).then(response => {
            setUser(response.data)
            setUserUpdate(null)

        })
    }

    function editData(userToEdit: User) {
        setUserUpdate(userToEdit)
    }

    useEffect(() => {
            service.get("/all").then(response =>
                setUsers(response.data)
            )
        }
        , [user])

    return (
        <>
            <GetStuffs users={users} myDelete={deleteData} myEdit={editData}/>
            <MakeStuffs myCreate={postData}/>
            <UpdateStuffs user={userUpdate} myUpdate={updateData}/>
        </>
    )
}

interface PropsGetStuffs {
    users: User[],
    myDelete: (id: number) => void
    myEdit: (userToEdit: User) => void
}

const GetStuffs = (props: PropsGetStuffs) => {

    function executeDelete(id: number) {
        if (!id) {
        } else {
            props.myDelete(id)
        }
    }

    function executeEdit(userToEdit: User) {
        if (!userToEdit) {
        } else {
            props.myEdit(userToEdit)
        }
    }

    return (
        <table className="table table-striped">
            <thead>
            <tr>
                <th scope="col">ID</th>
                <th scope="col">username</th>
                <th scope="col">email</th>
                <th scope="col">Delete</th>
                <th scope="col">Edit</th>
            </tr>
            </thead>
            <tbody>
            {props.users.map(user => {
                    return (
                        <tr key={user.id}>
                            <th scope="row">{user.id}</th>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td><Button variant="danger" onClick={() => user.id && executeDelete(user.id)}>Delete</Button>
                            </td>
                            <td><Button variant="warning" onClick={() => user.id && executeEdit(user)}>Edit</Button></td>

                        </tr>
                    )
                }
            )}
            </tbody>
        </table>
    )
}

interface PropsMyCreate {
    myCreate: (user: User) => void
}

function MakeStuffs(props: PropsMyCreate) {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const input = useRef(null)

    function executeAndCleanUp() {
        props.myCreate({username: username, email: email})
        setUsername("")
        setEmail("")
        if (input !== null) {
            // @ts-ignore
            input.current.focus()
        }
    }

    return (
        <Form>
            <label>
                username
                <input ref={input} className="form-control mb-3" value={username}
                       onChange={(e) => setUsername(e.target.value)}/>
            </label>
            <label>
                email
                <input className="form-control mb-3" value={email}
                       onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <Button variant="primary"
                    onClick={() => executeAndCleanUp()}>submit to create</Button>
        </Form>
    )
}

interface PropsUpdate {
    user: User | null,
    myUpdate: (user: User) => void
}

const UpdateStuffs = (props: PropsUpdate) => {

    const [myEmail, setMyEmail] = useState("")
    const [myUsername, setMyUsername] = useState("")
    const [myId, setMyId] = useState<number | "">("")

    useEffect(() => {
            setMyEmail(props.user ? props.user.email : "")
            setMyUsername(props.user ? props.user.username : "")
            if (props.user) {
                setMyId(props.user.id ? props.user.id : "")
            } else {
                setMyId("")
            }
        }
        , [props.user])

    function executeAndEdit() {
        if (!props.user) {
        } else {
            const myUser = props.user
            myUser.username = myUsername
            myUser.email = myEmail
            props.myUpdate(myUser)
            setMyUsername("")
            setMyEmail("")
        }
    }

    return (
        <Form>
            <label>
                id
                <input className="form-control mb-3" value={myId}
                       disabled/>
            </label>
            <label>
                username
                <input className="form-control mb-3" value={myUsername}
                       onChange={(e) => setMyUsername(e.target.value)}/>
            </label>
            <label>
                email
                <input className="form-control mb-3" value={myEmail}
                       onChange={(e) => setMyEmail(e.target.value)}/>
            </label>
            <Button variant="primary"
                    onClick={() => props.user && executeAndEdit()}>update</Button>
        </Form>
    )
}

export {Stuffs}