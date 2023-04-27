import "./List.css";
const List = (props: any) => {
  return (
    <div className="list-container">
      <h2>Id: {props.data.id} </h2>
      <h2>Job Title: {props.data.job_title}</h2>
      <h2>Company Name : {props.data.company_name}</h2>
      <h2> Salary: {props.data.salary}</h2>
    </div>
  );
};
export default List;
