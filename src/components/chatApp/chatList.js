import React, { useEffect, useState } from "react";
import './chatApp.css';
import { useHistory, Link, useLocation } from 'react-router-dom';
import { UsergroupAddOutlined , UserAddOutlined, DeleteFilled, EditFilled, CloseOutlined, SearchOutlined} from '@ant-design/icons';
import { Button, Input, Form, Modal, Alert} from 'antd';
import styled from 'styled-components';

import {
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBIcon,
    MDBBtn,
    MDBTypography,
    MDBTextArea,
    MDBCardHeader, MDBInput,
} from "mdb-react-ui-kit";

export default function ChatList({ handleClickMess, userList, selectedUser }) {
    const [socket, setSocket] = useState(null);
    const history = useHistory();
    // const location = useLocation();
    const [users, setUsers] = useState(userList);
    const [isChecked, setIsChecked] = useState(false); // Thêm state để lưu trữ trạng thái của checkbox
    const [roomName, setRoomName] = useState(""); // Thêm state để lưu trữ tên phòng chat mới
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    //join chat
    const [isModalJoinRoomOpen, setisModalJoinRoomOpen] = useState(false);
    //add groups chat
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModalJoinRoom = () => {
        setisModalJoinRoomOpen(true);
    }
    const handleJoinRoomCancel = () => {
        setisModalJoinRoomOpen(false);
        form.resetFields();
    };
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const [form] = Form.useForm();

    // const [selectedUser, setSelectedUser] = useState(null);


    //
    useEffect(() => {
        console.log(userList); // Đảm bảo danh sách người dùng được cập nhật
        setUsers(userList);
    }, [userList]);

    const handleLogout = () => {
        //Gửi yêu cầu đăng xuất đến server WebSocket
        const requestData = {
            action: "onchat",
            data: {
                event: "LOGOUT",
            },
        };
        socket.send(JSON.stringify(requestData));
        console.log("gui yeu cau logout thanh cong");
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("relogin_code");
        history.push("/");
    };

    useEffect(() => {
        // Khởi tạo kết nối với server qua websocket
        const socket = new WebSocket("ws://140.238.54.136:8080/chat/chat");

        socket.addEventListener("open", () => {
            console.log("WebSocket connection established.");
            const username = sessionStorage.getItem('user');
            const code = sessionStorage.getItem('code');

            // Gửi message RE_LOGIN để đăng nhập lại với thông tin user và code
            socket.send(JSON.stringify({
                    action: "onchat",
                    data: {
                        event: "RE_LOGIN",
                        data: {
                            user: username,
                            code: code,
                        }
                    }
                }
            ));

            socket.onmessage = (event) => {
                const response = JSON.parse(event.data);
                if (response.status === 'success' && response.event === 'GET_USER_LIST') {
                    const newRoom = response.data;
                    setRoomName(newRoom);
                }
            }
            setSocket(socket);
        });

        // Đóng kết nối khi component unmount
        return () => {
            socket.close();

        };
    }, []);

    // join rooms
    const handleJoinRoomOk = () => {
        const roomName = document.getElementById('roomName').value;
        debugger;
        if (roomName && socket) {
            // Gửi yêu cầu tạo phòng đến server WebSocket
            const requestData = {
                action: "onchat",
                data: {
                  event: "JOIN_ROOM",
                  data: {
                    name: roomName
                  }
                }
            };
            // Gửi requestData tới server WebSocket
            socket.send(JSON.stringify(requestData));
        }
        form.resetFields();
        setisModalJoinRoomOpen(false);
    };
    // create room
    const handleOk = () => {
        const roomName = document.getElementById('roomName').value;
        if (roomName && socket) {
            // Gửi yêu cầu tạo phòng đến server WebSocket
            const requestData = {
                "action": "onchat",
                "data": {
                "event": "CREATE_ROOM",
                "data": {
                "name": roomName
                    }
                }
            };

            // Gửi requestData tới server WebSocket
            socket.send(JSON.stringify(requestData));
        }
        form.resetFields();
        setIsModalOpen(false);
        <Alert message="Success Tips" type="success" showIcon />
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleRoomNameChange = (event) => {
        setRoomName(event.target.value);
    };



    const handleSearch = () => {
        // Tìm kiếm tin nhắn trong danh sách tin nhắn dựa trên searchQuery
        const results = users.filter((user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setSearchResults(results);
    };


    const FormStyled = styled(Form)`
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 2px 2px 2px 0;
        width: 67%;
        height: 40px;
        margin-top: 5px;
        margin-left: 5px;
        border: 1px solid rgb(230, 230, 230);
        border-radius: 0.2rem;
        .ant-form-item {
          flex: 1;
          margin-bottom: 0;
        }
        margin-right: 5px;
        background-color: buttonface;
        float: left;
    `;
    const ButtonAddFriendStyled = styled(Button)`
        float: left;
        padding-left: -100px;
        border: none !important;
        
    `;
    const ButtonStyled = styled(Button)`
        border: none !important;
        float: right !important;
    `;
    return (
        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
            <a className="d-flex justify-content-between">
                <div className="d-flex flex-row m-2">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/185/185846.png"
                        alt="avatar"
                        className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                        width="50"
                    />
                    <div className="pt-1" style={{marginTop: '5px'}}>
                        <h4 className="fw-bold font mb-0">{sessionStorage.getItem('user')}</h4>
                    </div>
                </div>
                <MDBBtn style={{height: '45px'}}
                        className='mt-2 gradient-custom-3' size='lg' onClick={handleLogout}>Đăng Xuất</MDBBtn>
            </a>
            <MDBCard>
                <MDBCardBody>
                    <div className="input-group mb-3">
                        <MDBInput
                            label="Tìm kiếm tin nhắn"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <MDBBtn 
                            onClick={handleSearch}
                            >   
                            Tìm kiếm
                        </MDBBtn>
                        <ButtonAddFriendStyled>
                            <Button
                                type="primary"
                                size='large'
                                icon={<UserAddOutlined />} 
                                className='join-room' 
                                onClick={showModalJoinRoom}>
                            </Button>
                            <Modal
                                title='Join Room'
                                open={isModalJoinRoomOpen}
                                onOk={handleJoinRoomOk}
                                onCancel={handleJoinRoomCancel}
                            >
                                <Form form={form} layout='vertical'>
                                  <Form.Item label='' name='name'>
                                    <Input
                                        type='text'
                                        id="roomName"
                                        value={roomName}
                                        placeholder='Enter room name ' />
                                  </Form.Item>
                                </Form>
                            </Modal>
                        </ButtonAddFriendStyled>
                        <ButtonStyled >
                          <Button
                              type="primary"
                              size='large'
                              icon={<UsergroupAddOutlined />} 
                              className='add-room' 
                              onClick={showModal}
                              >
                            </Button>
                            <Modal
                                title='Create New Room'
                                open={isModalOpen}
                                onOk={handleOk}
                                onCancel={handleCancel}
                            >
                                <Form form={form} layout='vertical'>
                                  <Form.Item label='Room name' name='name'>
                                    <Input
                                        type='text'
                                        id="roomName"
                                        value={roomName}
                                        placeholder='Enter room name ' />
                                  </Form.Item>
                                </Form>
                            </Modal>
                        </ButtonStyled>

                        {/* <div className="form-check align-content-end">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                                checked={isChecked}
                                onChange={handleCheckboxChange} // Thêm sự kiện onChange cho checkbox
                            />
                            <label className="form-check-label" htmlFor="flexCheckDefault">Room</label>
                        </div> */}
                    </div>
                    
                    <MDBTypography listUnStyled className="mb-0" style={{height: "415px", overflow: "scroll"}}>
                        <ul className="list-group list-group-light list-group-small">
                            {searchResults.map((user, index) => (
                                <li key={index}
                                    className={selectedUser === user.name ? 'active' : ''}
                                    onClick={() => handleClickMess(user.name, user.type)}>
                                    <a className="d-flex justify-content-between">
                                        <div className="d-flex flex-row">
                                            {user.type == 0 ? (
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/256/147/147142.png"
                                                    alt="avatar"
                                                    className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                                    width="50"
                                                />
                                            ) : (
                                                <img
                                                    src="https://cdn-icons-png.flaticon.com/512/5234/5234876.png"
                                                    alt="avatar"
                                                    className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                                    width="50"
                                                />
                                            )}
                                            <div className="pt-1">
                                                <p className="fw-bold mt-3">{user.name}</p>
                                                <p className="small text-muted">
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <p className="small text-muted mt-3">{user.actionTime}</p>
                                        </div>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </MDBTypography>
                </MDBCardBody>
            </MDBCard>
        </MDBCol>
    );
}
