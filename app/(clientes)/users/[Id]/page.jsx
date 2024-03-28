const getUser = async(id)=>{
    const res = await fetch(`https://reqres.in/api/users/${id}`);
    const data = await res.json();
    return data.data
}

const UsersPage = async({params}) => {

    const user = await getUser(params.Id)
 

  return <div>

   <div className="row">
    <div className="col-md-6 offset-md-3">
        <div className="card">
            <div className="card-header text-center">
                <img src={user.avatar} alt={user.email} style={{borderRadius:"50%"}}/>
            </div>
            <div className="card-body text-center">
            
                <h3>{user.id} {user.first_name} {user.last_name}</h3>
                <p>{user.email}</p>
                    
            </div>
        </div>
       
    </div>

   </div>
  </div>;
};
export default UsersPage;