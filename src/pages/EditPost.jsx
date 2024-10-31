import React, { useState, useEffect }from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import service from '../appwrite/databaseConfig'
import { PostForm, Container } from '../components/index'

function EditPost() {
    const [post,setPost] = useState(null);
    const {slug} = useParams();
    const navigate = useNavigate();
    useEffect(()=>{
        if (slug) {
            service.getPost(slug).then((post) => {
                if (post) {
                    setPost(post);
                }
            })
        }
    },[slug,navigate])
  return post ? (
    <div className='py-8'>
        <Container>
            <PostForm {...post} />
        </Container>
    </div>
  ) : null
}

export default EditPost