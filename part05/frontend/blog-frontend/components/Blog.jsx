import { useParams } from "react-router-dom";
import styled from "styled-components";

const Card = styled.div`
  max-width: 600px;
  margin: 1rem 0rem;
  padding: 1.5rem;
  background-color: #dbeafe;
  border: 2px solid #000;
  border-radius: 8px;
  box-shadow: 4px 4px 0 #000;
  font-family: "Inter", system-ui, sans-serif;
  color: #000;
`;

const Title = styled.h1`
  margin: 0 0 1rem;
  font-size: 1.75rem;
  font-weight: 800;
`;

const UrlLink = styled.a`
  display: inline-block;
  margin-bottom: 1rem;
  color: #000;
  font-weight: 700;
  word-break: break-all;
  text-decoration: underline;
  text-decoration-thickness: 2px;

  &:hover {
    background-color: #ffd60a;
  }
`;

const Likes = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-weight: 700;
`;

const Button = styled.button`
  padding: 0.5em 1em;
  font-size: 1rem;
  font-weight: 700;
  color: #000;
  background-color: #ffd60a;
  border: 2px solid #000;
  border-radius: 4px;
  box-shadow: 3px 3px 0 #000;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:hover {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0 #000;
  }

  &:active {
    transform: translate(3px, 3px);
    box-shadow: none;
  }
`;

const RemoveButton = styled(Button)`
  background-color: #ff1744;
  color: #fff;
  margin-top: 1rem;
`;

const AddedBy = styled.div`
  font-weight: 500;
`;

const Loading = styled.div`
  padding: 1rem;
  font-weight: 700;
`;

const Blog = ({ blogs, user, handleLike, handleRemove }) => {
  if (blogs.length === 0) return <Loading>Loading blog...</Loading>;

  const id = useParams().id;
  const blog = blogs.find(b => b.id === id);

  if (blog) {
    const canRemove = user && user.username === blog.user.username;
    const canLike = !!user;
    return (
      <Card className="blog">
        <Title>{blog.title}</Title>
        <UrlLink href={`${blog.url}`}>{blog.url}</UrlLink>
        <Likes>
          likes {blog.likes}
          {canLike && <Button onClick={() => handleLike(blog)}>like</Button>}
        </Likes>
        <AddedBy>Added by {blog.user.name}</AddedBy>
        {canRemove && (
          <RemoveButton onClick={() => handleRemove(blog)}>remove</RemoveButton>
        )}
      </Card>
    );
  }
};

export default Blog;
