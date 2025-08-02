import React from 'react'

function UserTable() {
  return (
    <div>
    <meta charSet="utf-8" />
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bootstrap User Management Data Table</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" />
    <style dangerouslySetInnerHTML={{__html: "\n    body {\n        color: #566787;\n\t\tbackground: #f5f5f5;\n\t\tfont-family: 'Varela Round', sans-serif;\n\t\tfont-size: 13px;\n\t}\n    .table-responsive {\n        margin: 30px 0;\n    }\n\t.table-wrapper {\n        min-width: 1000px;\n        background: #fff;\n        padding: 20px 25px;\n\t\tborder-radius: 3px;\n        box-shadow: 0 1px 1px rgba(0,0,0,.05);\n    }\n\t.table-title {\n\t\tpadding-bottom: 15px;\n\t\tbackground: #299be4;\n\t\tcolor: #fff;\n\t\tpadding: 16px 30px;\n\t\tmargin: -20px -25px 10px;\n\t\tborder-radius: 3px 3px 0 0;\n    }\n    .table-title h2 {\n\t\tmargin: 5px 0 0;\n\t\tfont-size: 24px;\n\t}\n\t.table-title .btn {\n\t\tcolor: #566787;\n\t\tfloat: right;\n\t\tfont-size: 13px;\n\t\tbackground: #fff;\n\t\tborder: none;\n\t\tmin-width: 50px;\n\t\tborder-radius: 2px;\n\t\tborder: none;\n\t\toutline: none !important;\n\t\tmargin-left: 10px;\n\t}\n\t.table-title .btn:hover, .table-title .btn:focus {\n        color: #566787;\n\t\tbackground: #f2f2f2;\n\t}\n\t.table-title .btn i {\n\t\tfloat: left;\n\t\tfont-size: 21px;\n\t\tmargin-right: 5px;\n\t}\n\t.table-title .btn span {\n\t\tfloat: left;\n\t\tmargin-top: 2px;\n\t}\n    table.table tr th, table.table tr td {\n        border-color: #e9e9e9;\n\t\tpadding: 12px 15px;\n\t\tvertical-align: middle;\n    }\n\ttable.table tr th:first-child {\n\t\twidth: 60px;\n\t}\n\ttable.table tr th:last-child {\n\t\twidth: 100px;\n\t}\n    table.table-striped tbody tr:nth-of-type(odd) {\n    \tbackground-color: #fcfcfc;\n\t}\n\ttable.table-striped.table-hover tbody tr:hover {\n\t\tbackground: #f5f5f5;\n\t}\n    table.table th i {\n        font-size: 13px;\n        margin: 0 5px;\n        cursor: pointer;\n    }\t\n    table.table td:last-child i {\n\t\topacity: 0.9;\n\t\tfont-size: 22px;\n        margin: 0 5px;\n    }\n\ttable.table td a {\n\t\tfont-weight: bold;\n\t\tcolor: #566787;\n\t\tdisplay: inline-block;\n\t\ttext-decoration: none;\n\t}\n\ttable.table td a:hover {\n\t\tcolor: #2196F3;\n\t}\n\ttable.table td a.settings {\n        color: #2196F3;\n    }\n    table.table td a.delete {\n        color: #F44336;\n    }\n    table.table td i {\n        font-size: 19px;\n    }\n\ttable.table .avatar {\n\t\tborder-radius: 50%;\n\t\tvertical-align: middle;\n\t\tmargin-right: 10px;\n\t}\n\t.status {\n\t\tfont-size: 30px;\n\t\tmargin: 2px 2px 0 0;\n\t\tdisplay: inline-block;\n\t\tvertical-align: middle;\n\t\tline-height: 10px;\n\t}\n    .text-success {\n        color: #10c469;\n    }\n    .text-info {\n        color: #62c9e8;\n    }\n    .text-warning {\n        color: #FFC107;\n    }\n    .text-danger {\n        color: #ff5b5b;\n    }\n    .pagination {\n        float: right;\n        margin: 0 0 5px;\n    }\n    .pagination li a {\n        border: none;\n        font-size: 13px;\n        min-width: 30px;\n        min-height: 30px;\n        color: #999;\n        margin: 0 2px;\n        line-height: 30px;\n        border-radius: 2px !important;\n        text-align: center;\n        padding: 0 6px;\n    }\n    .pagination li a:hover {\n        color: #666;\n    }\t\n    .pagination li.active a, .pagination li.active a.page-link {\n        background: #03A9F4;\n    }\n    .pagination li.active a:hover {        \n        background: #0397d6;\n    }\n\t.pagination li.disabled i {\n        color: #ccc;\n    }\n    .pagination li i {\n        font-size: 16px;\n        padding-top: 6px\n    }\n    .hint-text {\n        float: left;\n        margin-top: 10px;\n        font-size: 13px;\n    }\n" }} />
    <div className="container">
      <div className="table-responsive">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-xs-5">
                <h2>User <b>Management</b></h2>
              </div>
              <div className="col-xs-7">
                <a href="#" className="btn btn-primary"><i className="material-icons"></i> <span>Add New User</span></a>
                <a href="#" className="btn btn-primary"><i className="material-icons"></i> <span>Export to Excel</span></a>						
              </div>
            </div>
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>						
                <th>Date Created</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td><a href="#"><img src="/examples/images/avatar/1.jpg" className="avatar" alt="Avatar" /> Michael Holz</a></td>
                <td>04/10/2013</td>                        
                <td>Admin</td>
                <td><span className="status text-success">•</span> Active</td>
                <td>
                  <a href="#" className="settings" title="Settings" data-toggle="tooltip"><i className="material-icons"></i></a>
                  <a href="#" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td><a href="#"><img src="/examples/images/avatar/2.jpg" className="avatar" alt="Avatar" /> Paula Wilson</a></td>
                <td>05/08/2014</td>                       
                <td>Publisher</td>
                <td><span className="status text-success">•</span> Active</td>
                <td>
                  <a href="#" className="settings" title="Settings" data-toggle="tooltip"><i className="material-icons"></i></a>
                  <a href="#" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td><a href="#"><img src="/examples/images/avatar/3.jpg" className="avatar" alt="Avatar" /> Antonio Moreno</a></td>
                <td>11/05/2015</td>
                <td>Publisher</td>
                <td><span className="status text-danger">•</span> Suspended</td>                        
                <td>
                  <a href="#" className="settings" title="Settings" data-toggle="tooltip"><i className="material-icons"></i></a>
                  <a href="#" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                </td>                        
              </tr>
              <tr>
                <td>4</td>
                <td><a href="#"><img src="/examples/images/avatar/4.jpg" className="avatar" alt="Avatar" /> Mary Saveley</a></td>
                <td>06/09/2016</td>
                <td>Reviewer</td>
                <td><span className="status text-success">•</span> Active</td>
                <td>
                  <a href="#" className="settings" title="Settings" data-toggle="tooltip"><i className="material-icons"></i></a>
                  <a href="#" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                </td>
              </tr>
              <tr>
                <td>5</td>
                <td><a href="#"><img src="/examples/images/avatar/5.jpg" className="avatar" alt="Avatar" /> Martin Sommer</a></td>
                <td>12/08/2017</td>                        
                <td>Moderator</td>
                <td><span className="status text-warning">•</span> Inactive</td>
                <td>
                  <a href="#" className="settings" title="Settings" data-toggle="tooltip"><i className="material-icons"></i></a>
                  <a href="#" className="delete" title="Delete" data-toggle="tooltip"><i className="material-icons"></i></a>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text">Showing <b>5</b> out of <b>25</b> entries</div>
            <ul className="pagination">
              <li className="page-item disabled"><a href="#">Previous</a></li>
              <li className="page-item"><a href="#" className="page-link">1</a></li>
              <li className="page-item"><a href="#" className="page-link">2</a></li>
              <li className="page-item active"><a href="#" className="page-link">3</a></li>
              <li className="page-item"><a href="#" className="page-link">4</a></li>
              <li className="page-item"><a href="#" className="page-link">5</a></li>
              <li className="page-item"><a href="#" className="page-link">Next</a></li>
            </ul>
          </div>
        </div>
      </div>        
    </div>     
  </div>
  
  )
}

export default UserTable