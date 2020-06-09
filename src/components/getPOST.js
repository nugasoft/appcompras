const EjecutarApi = (data, api, token, method="POST") => {
    //https://api.chiapasavanza.com
  return new Promise( (resolve, reject) => {
  
      var requestInfo = {
          method: "POST",
          body: JSON.stringify(data),
          headers: new Headers({
              'Content-Type': 'application/json'
          })
      };

      if(method === "GET")
      {
          requestInfo = {
              method: "GET",
              headers: new Headers({
                  'Content-Type': 'application/json'
              })
          };
          
          fetch('https://api.chiapasavanza.com/api/'+api, requestInfo)
          .then(response => {
              if(response.ok){
              return response.json();
              }
              throw new Error(`Ocurrio un error: ${api}: ${response.statusText}`);
          })
          .then(dataRS => {

              if(!dataRS.success)
              {
                  const rs={
                      results: false,
                      data: {},
                      error: dataRS.error
                  }
                  reject(rs);
              }else
              {
                  resolve(dataRS);
              }
              
          
          })
          .catch(e => {
              const rs={
                  results: false,
                  data: {},
                  message: e.message
              }
              reject(rs);
          });
      }else
      {
          fetch('https://api.chiapasavanza.com/api/'+api, requestInfo)
          .then(response => {
              if(response.ok){
              return response.json();
              }
              throw new Error(`Ocurrio un error: ${api}: ${response.statusText}`);
          })
          .then(dataRS => {

              if(!dataRS.success)
              {
                  const rs={
                      results: false,
                      data: {},
                      error: dataRS.error
                  }
                  reject(rs);
              }else
              {
                  resolve(dataRS);
              }
              
          
          })
          .catch(e => {
              //console.log('==>Error: '+ api +': ', e);
              const rs={
                  results: false,
                  data: {},
                  message: e.message
              }
              reject(rs);
          });
      }
      
      


  })
}



export default EjecutarApi;