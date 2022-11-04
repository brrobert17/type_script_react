import {Button, Form} from "react-bootstrap";
import {useContext, useEffect, useRef, useState} from "react";
import service from "./service/service";
import 'bootstrap/dist/css/bootstrap.min.css'
import {UserContext} from "./context/UserContext";
import {User} from "./interface/interfaces";


const MainComponent = () => {

    const [usersArray, setUsersArray] = useState<User[] | []>([])
    const [user, setUser] = useState<User | null>(null)
    const [userToUpdate, setUserToUpdate] = useState<User | null>(null)

    useEffect(() => {
            service.get("/all").then(response => {
                    setUsersArray(response.data)
                }
            )
        }
        , [user])
    console.log("parent")

    return (
        <UserContext.Provider value={{usersArray, setUsersArray, user, setUser, userToUpdate, setUserToUpdate}}>
            <GetStuffs />
            <MakeStuffs />
            <UpdateStuffs />
        </UserContext.Provider>
    )
}

const GetStuffs = () => {

    const { user, setUser, usersArray, setUsersArray, updateUser, setUserToUpdate } = useContext(UserContext)

    function deleteData(id: number) {
        if(!id){}
        else {
            service.delete(`?id=${id}`).then(response => {
                setUser(response.data)
            })
    }}
    function editData(userToEdit: User) {
        setUserToUpdate(userToEdit)
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
            {usersArray.map((user: User) => {
                    return (
                        <tr key={user.id}>
                            <th scope="row">{user.id}</th>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td><Button variant="danger" onClick={() => user.id && deleteData(user.id)}>Delete</Button>
                            </td>
                            <td><Button variant="warning" onClick={() => user.id && editData(user)}>Edit</Button></td>

                        </tr>
                    )
                }
            )}
            </tbody>
        </table>
    )
}

function MakeStuffs() {

    const { user, setUser, usersArray, setUsersArray, userToUpdate, setUserToUpdate } = useContext(UserContext)

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const input = useRef(null)

    function postData(userToPost: User) {
        service.post("", userToPost).then(response => {
            setUser(response.data)
        })
        setUser({username: "new", email: "new"})
    }
    console.log(user,"child")

    function executeAndCleanUp() {
        const userToPost: User = {username: username, email: email}
        postData(userToPost)
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

const UpdateStuffs = () => {

    const { user, setUser, usersArray, setUsersArray, userToUpdate, setUserToUpdate } = useContext(UserContext)

    const [myEmail, setMyEmail] = useState("")
    const [myUsername, setMyUsername] = useState("")
    const [myId, setMyId] = useState<number | "">("")

    useEffect(() => {
            setMyEmail(userToUpdate ? userToUpdate.email : "")
            setMyUsername(userToUpdate ? userToUpdate.username : "")
            if (userToUpdate) {
                setMyId(userToUpdate.id ? userToUpdate.id : "")
            } else {
                setMyId("")
            }
        }
        , [userToUpdate])

    function updateData(userToEdit: User) {
        service.put("", userToEdit).then(response => {
            setUser(response.data)
            setUserToUpdate(null)
        })
    }


    function executeAndEdit() {
        if (!userToUpdate) {
        } else {
            const myUser = userToUpdate
            myUser.username = myUsername
            myUser.email = myEmail
            updateData(myUser)
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
                    onClick={() => executeAndEdit()}>update</Button>
        </Form>
    )
}

export {MainComponent}