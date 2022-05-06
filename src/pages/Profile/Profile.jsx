import React, { useEffect, useState, useMemo, createRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import './Profile.css';

// component
import Navbar from '../../components/Navbar/Navbar';
import Popup from '../../components/Popup/Popup';

// material ui
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const theme = createTheme({
    palette: {
        primary: {
            main: '#bdbdbd',
            darker: '#bdbdbd',
        },
        neutral: {
            main: '#fff',
            contrastText: '#fff',
        },
    },
});

function Profile() {

    let { id } = useParams();
    let navigate = useNavigate();
    const userId = id;
    const user = JSON.parse(localStorage.getItem('profile'));
    const [image, setImage] = useState('');
    const [postContent, setPostContent] = useState('');
    const [newContent, setNewContent] = useState('');
    const [userPost, setUserPost] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [buttonPopup, setButtonPopup] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [editPopup, setEditPopup] = useState(false);
    const [editCommentInput, setEditCommentInput] = useState(false);
    const [deletePostPopup, setDeletePostPopup] = useState(false);
    const [deleteCommentPopup, setDeleteCommentPopup] = useState(false);
    const [userProfile, setUserProfile] = useState({
        id: '',
        username: '',
        email: '',
        profile_style: '',
    });
    const [selectedPost, setSelectedPost] = useState('');
    const [comment, setComment] = useState('');
    const [newComment, setNewComment] = useState('');
    const [currentPost, setCurrentPost] = useState(0);
    const [selectedComment, setSelectedComment] = useState({
        postId: '',
        commentId: '',
    });
    const [userInfo, setUserInfo] = useState({
        username: '',
        password: '',
    });

    const commentInput = useMemo(() => userPost.map(i => createRef(null)));

    useEffect(() => {
        axios
            .get(`http://localhost:3001/post/${userId}`)
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    setUserPost(res.data);
                    setIsLoading(false);
                };
            });

        axios
            .get(`http://localhost:3001/user/${userId}`)
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    setUserProfile({ id: res.data._id, username: res.data.username, email: res.data.email, profile_style: res.data.profile_style });
                };
            });
    }, [userId]);

    // menu
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [anchorEl2, setAnchorEl2] = useState(null);
    const open2 = Boolean(anchorEl2);
    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };


    // refresh content
    const refreshContent = () => {
        axios
            .get(`http://localhost:3001/post/${userId}`)
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    setUserPost(res.data);
                    setIsLoading(false);
                };
            });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', 'yrmxpydc');

        if (image.length !== 0) {
            axios
                .post('https://api.cloudinary.com/v1_1/droul2qly/image/upload', formData)
                .then((res) => {
                    const data = { content: postContent, selectedFile: res.data.secure_url, username: user.result.username, creator: user.result._id, profile: user.result.profile_style };

                    axios
                        .post('http://localhost:3001/post', data, { headers: JSON.parse(localStorage.getItem('profile')).token })
                        .then((res) => {
                            if (res.data.err) {
                                console.log(res.data.err);
                            } else {
                                refreshContent();
                            };
                        });
                });
        } else {
            const data = { content: postContent, selectedFile: '', username: user.result.username, creator: user.result._id, profile: user.result.profile_style };

            axios
                .post('http://localhost:3001/post', data, { headers: JSON.parse(localStorage.getItem('profile')).token })
                .then((res) => {
                    if (res.data.err) {
                        console.log(res.data.err);
                    } else {
                        refreshContent();
                    };
                });
        }
        setPostContent('');
        setImage('');
    };

    const onSubmit2 = (e) => {
        const data = { username: userInfo.username, password: userInfo.password };
        e.preventDefault();
        axios
            .post('http://localhost:3001/user/signin', data)
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    localStorage.setItem('profile', JSON.stringify(res.data));
                    window.location.reload();
                }
            })
    };

    const deletePost = () => {
        axios
            .delete(`http://localhost:3001/post/delete/${selectedPost}`, { headers: localStorage.getItem('profile').token })
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    refreshContent();
                };
            });
    };

    const getPostId = (id) => {
        setSelectedPost(id);
    };

    const likePost = (id) => {
        if (!user) {
            setButtonPopup(true);
        } else {
            axios
                .patch(`http://localhost:3001/post/likePost/${id}`, { likeId: user?.result?._id }, { headers: JSON.parse(localStorage.getItem('profile')).token })
                .then((res) => {
                    if (res.data.err) {
                        console.log(res.data.err);
                    } else {
                        refreshContent();
                    };
                });
        };
    };

    const editPost = (e) => {
        e.preventDefault();
        axios
            .patch(`http://localhost:3001/post/edit/${selectedPost}`, { newContent }, { headers: JSON.parse(localStorage.getItem('profile')).token })
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    setEditPopup(false);
                    setNewContent('');
                    setSelectedPost('');
                    refreshContent();
                };
            });
    };

    // comment
    const getCommentInfo = (postId, commentId) => {
        setSelectedComment({ postId, commentId });
    };

    const handleComment = (index) => {
        if (!user) {
            setButtonPopup(true);
        } else {
            setCurrentPost(index);
            commentInput[index].current.focus();
        };
    };

    const commentPost = (id) => {
        const data = { user: user?.result?.username, user_id: user?.result?._id, user_profile: user?.result?.profile_style, comment };
        axios
            .post(`http://localhost:3001/post/comment/${id}`, data, { headers: JSON.parse(localStorage.getItem('profile')).token })
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    refreshContent();
                    commentInput[currentPost].current.value = '';
                };
            });
    };

    const updateComment = () => {
        axios
            .patch(`http://localhost:3001/post/editComment/${selectedComment.postId}`, { commentId: selectedComment.commentId, newComment }, { headers: JSON.parse(localStorage.getItem('profile')).token })
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    setEditCommentInput(false);
                    setNewComment('');
                    refreshContent();
                };
            });
    };

    const deleteComment = () => {
        axios
            .patch(`http://localhost:3001/post/deleteComment/${selectedComment.postId}`, { commentId: selectedComment.commentId }, { headers: JSON.parse(localStorage.getItem('profile')).token })
            .then((res) => {
                if (res.data.err) {
                    console.log(res.data.err);
                } else {
                    refreshContent();
                };
            });
    };

    return (
        <div className='profile'>
            <Navbar />
            {isLoading ? (
                <div style={{ width: '40%', marginLeft: 'auto', marginRight: 'auto', marginTop: '15%' }}>
                    <Box style={{ marginLeft: 'auto', marginRight: 'auto', width: '100px' }}>
                        <CircularProgress size={100} />
                    </Box>
                    <h1 style={{ textAlign: 'center', marginTop: 40 }}>Loading...</h1>
                </div>
            ) : (
                <div className='profile-body'>
                    <div className='profile-banner'>
                        <Avatar sx={{ bgcolor: userProfile.profile_style, height: 150, width: 150, marginLeft: 'auto', marginRight: 'auto' }}></Avatar>
                        <h1>{userProfile.username.replace(/\w\S*/g, m => m.charAt(0).toUpperCase() + m.substr(1).toLowerCase())}</h1>
                        <p className='p1'>@{userProfile.username} | {userProfile.email}</p>
                        {userPost.length > 1 ? (<p className='p2'>{userPost.length} Posts</p>) : (<p className='p2'>{userPost.length} Post</p>)}
                    </div>
                    {userId === user?.result?._id ? (
                        <>
                            {!showInput ? (
                                <div className='profile-post-add' onClick={() => setShowInput(true)}>
                                    <AddCircleOutlineIcon sx={{ marginTop: 1.5, color: 'gray' }} />
                                </div>
                            ) : (
                                <div className='profile-post-input'>
                                    <form onSubmit={onSubmit}>
                                        <ThemeProvider theme={theme}>
                                            <TextField
                                                id="outlined-textarea"
                                                placeholder="Share your moment"
                                                multiline
                                                minRows={4}
                                                value={postContent}
                                                onChange={(e) =>
                                                    setPostContent(e.target.value)
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && e.shiftKey) {
                                                        postContent = { ...postContent } + '<br/>'
                                                    }
                                                }}
                                                sx={{ width: '100%' }}
                                                color='primary'
                                            />
                                        </ThemeProvider>
                                        <div className='profile-post-button'>
                                            <input
                                                type='file'
                                                onChange={(e) => {
                                                    setImage(e.target.files[0]);
                                                }}
                                            />
                                            <button type='submit'>Post</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </>
                    ) : null}
                    {userPost.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).reverse().map((post, index) => {
                        return (
                            <div className='profile-content' key={index}>
                                <div className='content-header'>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <Link to={`/profile/${userId}`}>
                                            <Avatar onClick={() => navigate(`/profile/${userId}`)} style={{ cursor: 'pointer', backgroundColor: post.profile }}></Avatar>
                                        </Link>
                                        <div>
                                            <Link to={`/profile/${userId}`} style={{ textDecoration: 'none', color: 'black' }}>
                                                <p style={{ fontWeight: 'bold', marginTop: 2 }}>{post.username}</p>
                                            </Link>
                                            <p style={{ fontSize: 14 }}>{Number(moment().diff(moment(post.createdAt), 'hours')) > 24 ? moment(post.createdAt).format("d MMMM [at] HH:mm") : moment(post.createdAt).fromNow()}</p>
                                        </div>
                                    </div>
                                    {post.username === user?.result?.username ? (
                                        <>
                                            <Button
                                                id="basic-button"
                                                aria-controls={open ? 'basic-menu' : undefined}
                                                aria-haspopup="true"
                                                aria-expanded={open ? 'true' : undefined}
                                                onClick={(e) => { setAnchorEl(e.currentTarget); getPostId(post._id); setNewContent(post.content) }}
                                                sx={{ padding: '0 !important', height: 26, float: 'right' }}
                                            >
                                                <MoreHorizIcon sx={{ padding: 0 }} />
                                            </Button>
                                            <Menu
                                                id="basic-menu"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                MenuListProps={{
                                                    'aria-labelledby': 'basic-button',
                                                }}
                                                PaperProps={{ style: { marginLeft: -200, marginTop: 10, padding: '0 7px', width: 250, boxShadow: 'none', border: '1px solid lightgrey', borderRadius: 8 } }}
                                            >
                                                <MenuItem sx={{ height: 38 }} onClick={() => { setEditPopup(true); handleClose(); }}><EditIcon />&nbsp;&nbsp;Edit post</MenuItem>
                                                <hr size='1' width='90%' color='lightgrey' style={{ margin: '7px auto' }} />
                                                <MenuItem sx={{ height: 38 }} onClick={() => { setDeletePostPopup(true); handleClose(); }}><DeleteForeverIcon />&nbsp;&nbsp;Delete post</MenuItem>
                                            </Menu>
                                        </>
                                    ) : null}
                                </div>
                                <div className='content-text'>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
                                </div>
                                {
                                    post?.selectedFile ? (
                                        <div className='content-image'>
                                            <img src={post.selectedFile} alt='post image' />
                                        </div>
                                    ) : null
                                }
                                {post.likes.length > 0 ? <>{post.likes.length === 1 ? (<p style={{ fontSize: 15, marginBottom: 2, marginTop: 5 }}>{post.likes.length} like</p>) : (<p style={{ fontSize: 15, marginBottom: 2 }}>{post.likes.length} likes</p>)}</> : null}
                                <div className='content-footer'>
                                    {post.likes.find((like) => like === user?.result?._id) ? (
                                        <div style={{ display: 'flex', flexDirection: 'row' }} onClick={() => likePost(post._id)}>
                                            <FavoriteIcon sx={{ alignSelf: 'center', color: 'red' }} />
                                            <p style={{ alignSelf: 'center' }}>&nbsp;Like</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'row' }} onClick={() => likePost(post._id)}>
                                            <FavoriteBorderIcon sx={{ alignSelf: 'center' }} />
                                            <p style={{ alignSelf: 'center' }}>&nbsp;Like</p>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', flexDirection: 'row' }} onClick={() => handleComment(index)}>
                                        <ChatBubbleOutlineIcon sx={{ alignSelf: 'center' }} />
                                        <p style={{ alignSelf: 'center' }}>&nbsp;Comment</p>
                                    </div>
                                </div>
                                {post.comments !== null ? (
                                    <>
                                        {post.comments.map((comment, index) => {
                                            return (
                                                <div key={index} style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                                                    <Link to={`/profile/${comment.user_id}`}>
                                                        <Avatar sx={{ height: 32, width: 32, backgroundColor: comment.user_profile }}></Avatar>
                                                    </Link>
                                                    {editCommentInput && comment._id === selectedComment.commentId ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                                                <input
                                                                    type='text'
                                                                    className='comment-input'
                                                                    style={{ width: '100%', height: 32, marginLeft: 10, borderRadius: 20, border: 'none', backgroundColor: 'lightgray', paddingLeft: 12 }}
                                                                    value={newComment}
                                                                    onChange={(e) => setNewComment(e.target.value)}
                                                                    onKeyPress={(e) => {
                                                                        e.key === 'Enter' && updateComment()
                                                                    }}
                                                                />
                                                            </div>
                                                            <p style={{ fontSize: 12, marginLeft: 20, marginTop: 2, cursor: 'pointer' }} onClick={() => setEditCommentInput(false)}>Cancel</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div style={{ marginLeft: 10, padding: '7px 12px 8px 12px', backgroundColor: '#546e7a', borderRadius: 10 }}>
                                                                <Link to={`/profile/${comment.user_id}`} style={{ textDecoration: 'none' }}>
                                                                    <p style={{ fontWeight: 'bold', fontSize: 15, color: 'white', cursor: 'pointer' }}>{comment.user}</p>
                                                                </Link>
                                                                <p style={{ fontSize: 14, color: 'white' }}>{comment.comment}</p>
                                                            </div>
                                                        </>
                                                    )}
                                                    {comment.user_id === user?.result?._id ? (
                                                        <div style={{ paddingTop: 3 }} className='comment-option'>
                                                            <Button
                                                                id="basic-button"
                                                                aria-controls={open2 ? 'basic-menu' : undefined}
                                                                aria-haspopup="true"
                                                                aria-expanded={open2 ? 'true' : undefined}
                                                                onClick={(e) => { setAnchorEl2(e.currentTarget); getCommentInfo(post._id, comment._id); setNewComment(comment.comment) }}
                                                                sx={{ padding: '0 !important', borderRadius: 50, minWidth: 20, marginLeft: 1 }}
                                                            >
                                                                <MoreHorizIcon sx={{ padding: 1 }} />
                                                            </Button>
                                                            <Menu
                                                                id="basic-menu"
                                                                anchorEl={anchorEl2}
                                                                open={open2}
                                                                onClose={handleClose2}
                                                                MenuListProps={{
                                                                    'aria-labelledby': 'basic-button',
                                                                }}
                                                                PaperProps={{ style: { marginLeft: -130, marginTop: 10, padding: '0 7px', width: 300, boxShadow: 'none', border: '1px solid lightgrey', borderRadius: 8 } }}
                                                            >
                                                                <MenuItem sx={{ height: 36 }} onClick={() => { setEditCommentInput(true); handleClose2(); }}>Edit</MenuItem>
                                                                <MenuItem sx={{ height: 36 }} onClick={() => { setDeleteCommentPopup(true); handleClose2(); }}>Delete</MenuItem>
                                                            </Menu>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )
                                        })}
                                    </>
                                ) : null}
                                {user ? (
                                    <div>
                                        <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                                            <Avatar sx={{ height: 32, width: 32, backgroundColor: user?.result?.profile_style }}></Avatar>
                                            <input
                                                type='text'
                                                ref={commentInput[index]}
                                                style={{ width: '100%', marginLeft: 10, borderRadius: 20, border: 'none', backgroundColor: 'lightgray', paddingLeft: 12 }}
                                                placeholder='Write a comment...'
                                                onChange={(e) => setComment(e.target.value)}
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter') {
                                                        commentPost(post._id);
                                                    }
                                                }}
                                                onClick={() => handleComment(index)}
                                            />
                                        </div>
                                        <p style={{ fontSize: 12, marginLeft: 50, marginTop: 2 }}>Press Enter to post.</p>
                                    </div>
                                ) : null}
                            </div>
                        )
                    })}
                </div>
            )}
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <div className='popup-auth'>
                    <h1>Social</h1>
                    <form onSubmit={onSubmit2}>
                        <input
                            type='text'
                            placeholder='Username'
                            required
                            value={userInfo.username}
                            onChange={(e) => setUserInfo({ ...userInfo, username: e.target.value })}
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            required
                            value={userInfo.password}
                            onChange={(e) => setUserInfo({ ...userInfo, password: e.target.value })}
                            style={{ marginTop: 10 }}
                        />
                        {userInfo.username && userInfo.password ? <button type='submit' style={{ backgroundColor: '#ec407a', cursor: 'pointer' }}>Sign In</button> : <button type='submit' style={{ backgroundColor: '#f48fb1' }} disabled>Sign In</button>}
                    </form>
                    <hr style={{ margin: '30px auto 30px auto' }} width='90%' />
                    <p style={{ marginBottom: 10, fontSize: 13, textAlign: 'center' }}>Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: '#ec407a', fontWeight: 'bold', cursor: 'pointer' }}>Sign up</span></p>
                </div>
            </Popup>

            <Popup trigger={editPopup} setTrigger={setEditPopup}>
                <h2 style={{ textAlign: 'center', marginLeft: 30, marginBottom: 10 }}>Edit Post</h2>
                <hr style={{ marginLeft: -20, marginRight: -20 }} color='lightgrey' />
                <div className='content-edit'>
                    <form onSubmit={editPost}>
                        <ThemeProvider theme={theme}>
                            <TextField
                                id="outlined-textarea"
                                multiline
                                minRows={4}
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.shiftKey || e.key === 'Enter') {
                                        newContent = { ...newContent } + '<br/>'
                                    }
                                }}
                                sx={{ width: '100%' }}
                                color='primary'
                            />
                        </ThemeProvider>
                        <button type='submit' style={{ width: '100%', height: 34, marginTop: 20, border: 'none', borderRadius: 10, backgroundColor: '#ec407a', color: 'white' }}>Save</button>
                    </form>
                </div>
            </Popup>

            <Popup trigger={deletePostPopup} setTrigger={setDeletePostPopup}>
                <div style={{ width: 500 }}>
                    <h2 style={{ marginBottom: 10 }}>Delete Post?</h2>
                    <hr style={{ marginLeft: -20, marginRight: -20 }} color='lightgrey' />
                    <p style={{ marginTop: 10 }}>Are you sure you want to delete this post?</p>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30 }}>
                        <button onClick={() => setDeletePostPopup(false)} style={{ height: 36, width: 80, marginRight: 10, border: 'none', backgroundColor: 'transparent', color: '#ec407a', fontSize: 16, cursor: 'pointer' }}>No</button>
                        <button onClick={() => { deletePost(); setDeletePostPopup(false); }} style={{ height: 36, width: 80, border: 'none', borderRadius: 6, backgroundColor: '#ec407a', color: 'white', fontSize: 16, cursor: 'pointer' }} >Delete</button>
                    </div>
                </div>
            </Popup>

            <Popup trigger={deleteCommentPopup} setTrigger={setDeleteCommentPopup}>
                <div style={{ width: 500 }}>
                    <h2 style={{ marginBottom: 10 }}>Delete Comment?</h2>
                    <hr style={{ marginLeft: -20, marginRight: -20 }} color='lightgrey' />
                    <p style={{ marginTop: 10 }}>Are you sure you want to delete this comment?</p>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30 }}>
                        <button onClick={() => setDeleteCommentPopup(false)} style={{ height: 36, width: 80, marginRight: 10, border: 'none', backgroundColor: 'transparent', color: '#ec407a', fontSize: 16, cursor: 'pointer' }}>No</button>
                        <button onClick={() => { deleteComment(); setDeleteCommentPopup(false); }} style={{ height: 36, width: 80, border: 'none', borderRadius: 6, backgroundColor: '#ec407a', color: 'white', fontSize: 16, cursor: 'pointer' }} >Delete</button>
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default Profile