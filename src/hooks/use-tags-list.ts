import { useStaticQuery, graphql } from "gatsby";

const useTagsList = (): GatsbyTypes.MarkdownRemarkGroupConnection[] => {
  const { allMarkdownRemark } = useStaticQuery<GatsbyTypes.TagsListQueryQuery>(
    graphql`
      query TagsListQuery {
        allMarkdownRemark(
          filter: {
            frontmatter: { template: { eq: "post" }, draft: { ne: true } }
          }
        ) {
          group(field: frontmatter___tags) {
            fieldValue
            totalCount
          }
        }
      }
    `
  );

  return allMarkdownRemark.group;
};

export default useTagsList;
