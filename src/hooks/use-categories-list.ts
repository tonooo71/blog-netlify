import { useStaticQuery, graphql } from "gatsby";

const useCategoriesList = (): GatsbyTypes.MarkdownRemarkGroupConnection[] => {
  const { allMarkdownRemark } = useStaticQuery<GatsbyTypes.CategoriesListQueryQuery>(
    graphql`
      query CategoriesListQuery {
        allMarkdownRemark(
          filter: {
            frontmatter: { template: { eq: "post" }, draft: { ne: true } }
          }
        ) {
          group(field: frontmatter___category) {
            fieldValue
            totalCount
          }
        }
      }
    `
  );

  return allMarkdownRemark.group;
};

export default useCategoriesList;
