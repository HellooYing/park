// const a = require('../server/models/owner');
// const b = require('../server/models/parking');
// const c = require('../server/models/parkingtime');
// const d = require('../server/models/history');
// const e = require('../server/models/user');
let mysql = require('mysql');
var async = require('async');

var conn = mysql.createConnection({
  host: 'localhost',    //服务器端口
  user: 'root',           //数据库用户名
  password: 'ma592624',         //密码
  database: 'xcx',   //指定连接的数据库
  port: 3306            //服务器的端口号
});

var options = {
  'host': 'localhost',
  'port': 3306,
  'database': 'xcx',
  'user': 'root',
  'password': 'ma592624'
}

var pool = mysql.createPool(options);

exports.addowner = function(id, name, idcard) {
  var aa = id
  var bb = "'" + name + "'"
  var cc = "'" + idcard + "'"
  sql = 'insert into owner (id,name,idcard) values(' + aa + ',' + bb + ',' + cc + ')'
  conn.query(sql, function(err, result) {
    if (err) throw err;
    console.log(result);
  })
}
exports.addparking = function(id, ownerId,kind, name, location,lola,number, lease) {
  var aa = id
  var bb = ownerId
  var cc = kind
  var dd = "'" + name + "'"
  var ee = "'" + location + "'"
  var ff = "'" + lola + "'"
  var gg = number
  var ii = "'" + lease + "'"
  sql = 'insert into parking (id,ownerId,kind,name,location,lola,number,lease) values(' + aa + ',' + bb + ',' + cc + ',' + dd + ',' + ee + ',' + ff + ',' + gg + ','+ ii + ')'
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  })
}

exports.addparkingtime = function(id, parking, time, price,rentnumber) {
  var aa = id
  var bb = parking
  var cc = "'" + time + "'"
  var dd = "'" + price + "'"
  var ee = rentnumber
  sql = 'insert into parkingtime (id,parking,time,price,rentnumber) values(' + aa + ',' + bb + ',' + cc + ',' + dd +',' + ee+ ')'
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  })
}
exports.addhistory = function(id, parkingid, time, price,carnumber) {
  var aa = id
  var bb = parkingid
  var cc = "'" + time + "'"
  var dd = "'" + price + "'"
  var ee =  "'" + carnumber + "'"
  sql = 'insert into history (id, parkingid, time, price,carnumber) values(' + aa + ',' + bb + ',' + cc + ',' + dd +',' + ee+ ')'
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  })
}
exports.adduser = function(openid,carnumber) {
  var aa = openid
  var bb =  "'" + carnumber + "'"
  sql = 'insert into user (openid,carnumber) values(' + aa + ',' + bb + ')'
  conn.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
  })
}
exports.changeowner = function(id, name, idcard) {
  var modSql = 'UPDATE owner SET name = ?,idcard = ? WHERE Id = ?';
  var modSqlParams = [name, idcard, id];
  conn.query(modSql, modSqlParams, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      return;
    }
  })
}

exports.changeparking = function (id, ownerId, kind, name, location, lola, number, lease) {
  var modSql = 'UPDATE parking SET ownerId = ?,kind=?,name = ?, location=?,lola=?, number=?,lease=? WHERE Id = ?';
  var modSqlParams = [ownerId, kind, name, location, lola, number,lease,id];
  conn.query(modSql, modSqlParams, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      return;
    }
  })
}

exports.changeparkingtime = function(id, parking, time, price,rentnumber) {
  var modSql = 'UPDATE parkingtime SET parking = ?,time = ?,price =?,rentnumber=? WHERE Id = ?';
  var modSqlParams = [parking, time, price,rentnumber, id];
  conn.query(modSql, modSqlParams, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      return;
    }
  })
}

exports.changehistory = function(id, parkingid, time, price,carnumber) {
  var modSql = 'UPDATE history SET parkingid = ?,time = ?,price =?,carnumber=? WHERE Id = ?';
  var modSqlParams = [parkingid, time, price,carnumber, id];
  conn.query(modSql, modSqlParams, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      return;
    }
  })
}

exports.changeuser = function(openid, carnumber) {
  var modSql = 'UPDATE user SET carnumber=? WHERE openid = ?';
  var modSqlParams = [carnumber, openid];
  conn.query(modSql, modSqlParams, function (err, result) {
    if (err) {
      console.log('[UPDATE ERROR] - ', err.message);
      return;
    }
  })
}
exports.deleteowner = function(id) {
  var delSql = 'DELETE FROM owner where id=' + String(id);
  conn.query(delSql, function (err, result) {
    if (err) {
      console.log('[DELETE ERROR] - ', err.message);
      return;
    }
  })
}

exports.deleteparking = function deleteparking(id) {
  var delSql = 'DELETE FROM parking where id=' + String(id);
  conn.query(delSql, function (err, result) {
    if (err) {
      console.log('[DELETE ERROR] - ', err.message);
      return;
    }
  })
}

exports.deleteparkingtime= function(id) {
  var delSql = 'DELETE FROM parkingtime where id=' + String(id);
  conn.query(delSql, function (err, result) {
    if (err) {
      console.log('[DELETE ERROR] - ', err.message);
      return;
    }
  })
}

exports.deletehistory= function(id) {
  var delSql = 'DELETE FROM history where id=' + String(id);
  conn.query(delSql, function (err, result) {
    if (err) {
      console.log('[DELETE ERROR] - ', err.message);
      return;
    }
  })
}
exports.deleteuser= function(id) {
  var delSql = 'DELETE FROM user where id=' + String(id);
  conn.query(delSql, function (err, result) {
    if (err) {
      console.log('[DELETE ERROR] - ', err.message);
      return;
    }
  })
}

function execQuery(sql, values, callback) {
  var errinfo;
  pool.getConnection(function (err, connection) {
    if (err) {
      errinfo = 'DB-获取数据库连接异常！';
      throw errinfo;
    } else {
      var querys = connection.query(sql, values, function (err, rows) {
        release(connection);
        if (err) {
          errinfo = 'DB-SQL语句执行错误:' + err;
          callback(err);
        } else {
          callback(null, rows);        //注意：第一个参数必须为null
        }
      });
    }
  });
}

function release(connection) {
  try {
    connection.release(function (error) {
      if (error) {
        console.log('DB-关闭数据库连接异常！');
      }
    });
  } catch (err) { }
}

exports.selectowner = function (idORnameORidcard, content, callback) {
  return new Promise(function (resolve, reject) {
    var option = new Array();
    var sql = 'select * from owner where ' + String(idORnameORidcard) + '=' + String(content)
    execQuery(sql, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
        for (var i = 0; i < rows.length; i++) {
          option.push({ 'id': rows[i].id, 'name': rows[i].name, 'idcard': rows[i].idcard });
        }
        callback(option)
      }
    })
  })
}

exports.selectparking = function (idORownerIdORkindORnameORlocationORlolaORnumberORlease, content, callback) {
  return new Promise(function (resolve, reject) {
    var option = new Array();
    var sql = 'select * from parking where ' + String(idORownerIdORkindORnameORlocationORlolaORnumberORlease) + '=' + String(content)
    execQuery(sql, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
        for (var i = 0; i < rows.length; i++) {
          option.push({ 'id': rows[i].id, 'ownerId': rows[i].ownerId, 'kind':rows[i].kind,'name': rows[i].name, 'location': rows[i].location,"lola":rows[i].lola, 'number': rows[i].number,'lease': rows[i].lease });
        }
        callback(option)
      }
    })
  })
}

exports.selectparkingtime = function (idORparkingORtimeORpriceORrentnumber, content, callback) {
  return new Promise(function (resolve, reject) {
    var option = new Array();
    var sql = 'select * from parkingtime where ' + String(idORparkingORtimeORpriceORrentnumber) + '=' + String(content)
    execQuery(sql, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
        for (var i = 0; i < rows.length; i++) {
          option.push({ 'id': rows[i].id, 'parking': rows[i].parking, 'time': rows[i].time, 'price': rows[i].price,'rentnumber':rows[i].rentnumber });
        }
        callback(option)
      }
    })
  })
}

exports.selecthistory = function (idORparkingidORtimeORpriceORcarnumber, content, callback) {
  return new Promise(function (resolve, reject) {
    var option = new Array();
    var sql = 'select * from history where ' + String(idORparkingidORtimeORpriceORcarnumber) + '=' + String(content)
    execQuery(sql, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
        for (var i = 0; i < rows.length; i++) {
          option.push({ 'id': rows[i].id, 'parkingid': rows[i].parkingid, 'time': rows[i].time, 'price': rows[i].price,'carnumber':rows[i].carnumber });
        }
        callback(option)
      }
    })
  })
}

exports.selectuser = function (openidORcarnumber, content, callback) {
  return new Promise(function (resolve, reject) {
    var option = new Array();
    var sql = 'select * from user where ' + String(openidORcarnumber) + '=' + String(content)
    execQuery(sql, function (err, rows) {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
        for (var i = 0; i < rows.length; i++) {
          option.push({ 'openid': rows[i].openid,'carnumber':rows[i].carnumber });
        }
        callback(option)
      }
    })
  })
}