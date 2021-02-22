import React from "react";
import { Link } from "gatsby";
import Author from "./Author";
import Comments from "./Comments";
import Content from "./Content";
import Meta from "./Meta";
import Tags from "./Tags";
import styles from "./Post.module.scss";

type Post = {
  post: GatsbyTypes.MarkdownRemark;
};

const Post: React.FC<Post> = ({ post }) => {
  const { html } = post;

  if (
    html == undefined ||
    post.fields == undefined ||
    post.frontmatter == undefined
  )
    return null;

  const { tagSlugs, slug } = post.fields;
  const { tags, title, date } = post.frontmatter;

  if (slug == undefined || title == undefined || date == undefined) return null;

  return (
    <div className={styles["post"]}>
      <Link className={styles["post__home-button"]} to="/">
        All Articles
      </Link>

      <div className={styles["post__content"]}>
        <Content body={html} title={title} />
      </div>

      <div className={styles["post__footer"]}>
        <Meta date={date} />
        {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
        <Author />
      </div>

      <div className={styles["post__comments"]}>
        <Comments postSlug={slug} postTitle={title} />
      </div>
    </div>
  );
};

export default Post;
