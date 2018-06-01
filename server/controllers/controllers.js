const fc = require('../../server/function')
const ofc = require('../../server/otherfunction')
const fs = require('fs');
var path = require('path');
const request=require('request')
const async = require('async');
exports.login = async (ctx, next) => {
  code = ctx.request.body.code
  function c(option) {
    ctx.response.body = { openId: JSON.parse(option).openid, err: JSON.parse(option) }
  }
  var res = await ofc.xcxlogin(code, c);
}


exports.userparks = async (ctx, next) => {
  var userparkserr
  if (ctx.request.body.type == "get") {
    var all = []
    var parking
    var parkingtime = []
    var isOpen
    var rentPark

    function KIND3() {
      this.parkName = "return err"
      this.kind = "return err"
      this.allPark = "return err"
      this.rentPark = "return err"
      this.parkId = "return err"
      this.isOpen = "return err"
    }

    function KIND4() {
      this.parkName = "return err"
      this.kind = "return err"
      this.parkId = "return err"
      this.isOpen = "return err"
      this.allPark = "return err"
      this.rentPark = "return err"
      this.expectedRevenue = "return err"
    }

    function cc(option) {
      using = ofc.using(option)
      if (using == 0) {
        all[m].isOpen = false
        all[m].rentPark = 0
        all[m].expectedRevenue = 0
      }
      else {
        all[m].isOpen = true
        all[m].rentPark = using.rentNumber
        all[m].expectedRevenue = ofc.income(option[0].id)
      }
      m = m + 1
      //ofc.cleanparkingtime(option)
    }

    function c(option) {
      parking = option
      let t
      for (i = 0; i < option.length; i++) {
        if (option[i].kind == 3) {
          t = new KIND3
          t.parkName = option[i].name
          t.kind = option[i].kind
          t.allPark = option[i].number
          t.rentPark = "waiting"
          t.parkId = option[i].id
          t.isOpen = "waiting"
        }
        else if (option[i].kind == 4) {
          t = new KIND4
          t.parkName = option[i].name
          t.kind = option[i].kind
          t.parkId = option[i].id
          t.isOpen = "waiting"
          t.allPark = option[i].number
          t.rentPark = "waiting"
          t.expectedRevenue = "waiting"
        }
        else {
          ctx.body = { err: "kind不是3也不是4" }
          userparkserr = 1
        }
        all.push(t)
      }
    }
    await fc.selectparking("openId", ctx.request.body.openId, c)
    if (userparkserr == 1) { return }
    var m = 0
    while (m < parking.length) {
      await fc.selectparkingtime("parking", parking[m].id, cc)
    }
    ctx.response.body = all
    return
  }
  else if (ctx.request.body.type == "delete") {
    fc.deleteparking(ctx.request.body.parkId)
    await fc.selectparkingtime("parking", ctx.request.body.parkId, function (option) {
      fc.deleteparkingtime(option[0].id)
    })
  }
  else if (ctx.request.body.type == "open") {
    fc.changeone("parking", ctx.request.body.parkId, "isOpen", 1)
    await fc.selectparkingtime("parking", ctx.request.body.parkId, function (option) {
      for (let i = 0; i < option.length; i++) {
        if (option) {
          fc.deleteparkingtime(option[i].id)
        }
      }
    })
    var now = new Date()
    var year = now.getFullYear()
    var month = now.getMonth() + 1
    var day = now.getDate()
    var hour = now.getHours()
    var minute = now.getMinutes()
    if (ctx.request.body.kind == 3) {
      if (ctx.request.body.openType == "weekly") {
        await fc.addparkingtime(ctx.request.body.parkId,
          ctx.request.body.startDay + "."
          + ctx.request.body.startTime.replace(/:/g, ".")
          + "-" + ctx.request.body.endDay + "."
          + ctx.request.body.endTime.replace(/:/g, "."),
          ctx.request.body.price, null, 0)
        //这里要添加更新rentNumber的东西
      }
      else if (ctx.request.body.openType == "once") {
        await fc.addparkingtime(ctx.request.body.parkId,
          year + "." + month + "." + day + "."
          + ctx.request.body.startTime.replace(/:/g, ".")
          + "-" + year + "." + month + "." + day + "."
          + ctx.request.body.endTime.replace(/:/g, "."),
          ctx.request.body.price, null, 1)
      }
      else if (ctx.request.body.openType == "date") {
        await fc.addparkingtime(ctx.request.body.parkId,
          ctx.request.body.startDay.replace(/-/g, ".") + "."
          + ctx.request.body.startTime.replace(/:/g, ".")
          + "-" + ctx.request.body.endDay.replace(/-/g, ".") + "."
          + ctx.request.body.endTime.replace(/:/g, "."),
          ctx.request.body.price, null, 1)

      }
    }
    else if (ctx.request.body.kind == 4) {
      if (ctx.request.body.openType == "weekly") {
        await fc.addparkingtime(ctx.request.body.parkId,
          ctx.request.body.startDay + "."
          + ctx.request.body.startTime.replace(/:/g, ".")
          + "-" + ctx.request.body.endDay + "."
          + ctx.request.body.endTime.replace(/:/g, "."), null, null, 0)
      }
      else if (ctx.request.body.openType == "once") {
        await fc.addparkingtime(ctx.request.body.parkId, year
          + "." + month + "." + day + "."
          + ctx.request.body.startTime.replace(/:/g, ".")
          + "-" + year + "." + month + "." + day + "."
          + ctx.request.body.endTime.replace(/:/g, "."), null, null, 1)
      }
      else if (ctx.request.body.openType == "date") {
        await fc.addparkingtime(ctx.request.body.parkId,
          ctx.request.body.startDay.replace(/-/g, ".") + "."
          + ctx.request.body.startTime.replace(/:/g, ".")
          + "-" + ctx.request.body.endDay.replace(/-/g, ".") + "."
          + ctx.request.body.endTime.replace(/:/g, "."), null, null, 1)
      }
    }
    fc.changeone("parking", ctx.request.body.parkId, "name", ctx.request.body.parkName)
  }
  else if (ctx.request.body.type == "detail") {
    var all
    var parking
    function KIND() {
      this.parkName = "return err"
      this.kind = "return err"
      this.isOpen = "return err"
      this.openType = "return err"
      this.startDay = "return err"
      this.endDay = "return err"
      this.startTime = "return err"
      this.endTime = "return err"
    }
    await fc.selectparking("parking", ctx.request.body.parkId, function (option) {
      parking = option
      let t
      t = new KIND
      t.parkName = option[0].name
      t.kind = option[0].kind
      t.isOpen = option[0].isOpen
      t.openType = "waiting"
      t.startDay = "waiting"
      t.endDay = "waiting"
      t.startTime = "waiting"
      t.endTime = "waiting"
      all = t
    })
    await fc.selectparkingtime("parking", parking[0].id, function (option) {
      if (option) {
        let time = option[0].time
        time = time.split("-")
        let start = t[0]
        start = start.split(".")
        let end = t[1]
        end = end.split(".")
        if (start.length == 3) {
          all.openType = "weekly"
          all.startDay = start[0]
          all.endDay = end[0]
          all.startTime = start[1] + ":" + start[2]
          all.endTime = end[1] + ":" + end[2]
        }
        if (start.length == 5) {
          if (start[2] == end[2]) { all.openType = "once" }
          else { all.openType = "date" }
          all.startDay = start[0] + "-" + start[1] + "-" + start[2]
          all.endDay = end[0] + "-" + end[1] + "-" + end[2]
          all.startTime = start[3] + ":" + start[4]
          all.endTime = end[3] + ":" + end[4]
        }
      }
      else {
        all.openType = null
        all.startDay = null
        all.endDay = null
        all.startTime = null
        all.endTime = null
      }
    })
    ctx.response.body = all
  }

  else if (ctx.request.body.type == "close") {
    fc.changeone("parking", ctx.request.body.parkId, "isOpen", 0)
    function c(option) {
      for (let i = 0; i < option.length; i++) {
        fc.deleteparkingtime(option[i].id)
      }
    }
    fc.selectparkingtime("parking", ctx.request.body.parkId, c)
  }
}

exports.userplatenumber = async (ctx, next) => {
  if (ctx.request.body.type == "get") {
    let openId = ctx.request.body.openId
    let carNumber
    function c(option) {
      if (option[0]) {
        ctx.body = { carNumber: option[0].carNumber.split(".") }
      }
    }
    await fc.selectuser("openId", openId, c)
  }
  else if (ctx.request.body.type == "add") {
    function c(option) {
      if (option[0]) {

        Repeat = option[0].carNumber + "." + ctx.request.body.plateNumber
        Repeat = Repeat.split(".")
        cleanRepeat = ofc.unique(Repeat)
        let str = cleanRepeat[0]
        for (let i = 1; i < cleanRepeat.length; i++) {
          str = str + "." + cleanRepeat[i]
        }
        fc.changeou("user", ctx.request.body.openId, "carNumber", str)
        ctx.body = str
      }
      else {
        fc.adduser(ctx.request.body.openId, ctx.request.body.plateNumber)
        ctx.body = ctx.request.body.plateNumber
      }
    }
    await fc.selectuser("openId", ctx.request.body.openId, c)
  }
}

exports.upload = async (ctx, next) => {
  ctx.response.status=200;
  if (ctx.request.body.kind) {
    fc.addparking(ctx.request.body.openId,
      ctx.request.body.kind, null, null,
      ctx.request.body.longitude + "," + ctx.request.body.latitude, null, null)
    fc.selectowner("openId", '"' + ctx.request.body.openId + '"', function (option) {
      if (option == "") {
        fc.addowner('"' + ctx.request.body.openId + '"')
      }
    })
  }
  if (ctx.request.body.files) {
    await fs.exists(`upload/` + ctx.request.body.fields.openId, function (exists) {
      if (!exists) {
        function mkdir(dirpath, dirname) {
          if (typeof dirname === "undefined") {
            if (fs.existsSync(dirpath)) {
              return;
            } else {
              mkdir(dirpath, path.dirname(dirpath));
            }
          } else {
            if (dirname !== path.dirname(dirpath)) {
              mkdir(dirpath);
              return;
            }
            if (fs.existsSync(dirname)) {
              fs.mkdirSync(dirpath)
            } else {
              mkdir(dirname, path.dirname(dirname));
              fs.mkdirSync(dirpath);
            }
          }
        }
        mkdir(`upload/` + ctx.request.body.fields.openId)
      }
      const file = ctx.request.body.files.image;
      const reader = fs.createReadStream(file.path);
      const ext = file.name.split('.').pop();
      let upStream = fs.createWriteStream(`upload/` + ctx.request.body.fields.openId + `/` + ctx.request.body.fields.index + `.jpg`);
      reader.pipe(upStream);
      if (ctx.request.body.fields.imageNumber != ctx.request.body.fields.index) {
        ctx.body = {1:1}
      }
    })
    if (ctx.request.body.fields.imageNumber == ctx.request.body.fields.index) {
      await fc.selectparking("openId", '"' + ctx.request.body.fields.openId + '"', function (option) {
        if (option != "") {
          ctx.body = { parkId: option[option.length - 1].id }
        }
        else { ctx.body = { err: "该用户停车场上传失败" } }
        fs.rename(`upload/` + ctx.request.body.fields.openId, `upload/` + ctx.request.body.fields.openId + "-" + option[option.length - 1].id, function (err) {
          if (err) {
            console.log("将文件名修改为openid+parkid失败");
          }
        })
      })
    }
  }
}

exports.gethistory = async (ctx, next) => {
  if (ctx.request.body.type == "get") {
    await fc.selecthistory("openId", ctx.request.body.openId, function (option) {
      if (option.length <= 10) {
        all = []
        function RESP() {
          this.isPaid = "return err"
          this.isDone = "return err"
          this.parkLocation = "return err"
          this.startTime = "return err"
          this.startDate = "return err"
          this.endTime = "return err"
          this.endDate = "return err"
          this.fee = "return err"
          this.recordId = "return err"
          this.parkId = "return err"
          this.parkLatitude = "return err"
          this.parkLongitude = "return err"
        }
        for (let i = 0; i < option.length; i++) {
          let t = new RESP
          t.isPaid = option[i].isPaid
          t.isDone = option[i].isDone
          t.parkLocation = option[i].location
          t.fee = option[i].pay
          t.recordId = option[i].id
          t.parkId = option[i].parking
          let time = option[i].time
          time = time.split("-")
          let s = time[0]
          let e = time[1]
          s = s.split(".")
          e = e.split(".")
          t.startTime = s[3] + ":" + s[4]
          t.startDate = s[0] + "-" + s[1] + "-" + s[2]
          t.endTime = e[3] + ":" + e[4]
          t.endDate = e[0] + "-" + e[1] + "-" + e[2]
          t.parkLatitude = option[i].lola.split(",")[1]
          t.parkLongitude = option[i].lola.split(",")[0]
          all.push(t)
        }
        all = all.reverse()
        ctx.body = all
      }
      else if (ctx.request.body.filter == "month") {
        all = []
        function RESP() {
          this.isPaid = "return err"
          this.isDone = "return err"
          this.parkLocation = "return err"
          this.startTime = "return err"
          this.startDate = "return err"
          this.endTime = "return err"
          this.endDate = "return err"
          this.fee = "return err"
          this.recordId = "return err"
          this.parkId = "return err"
          this.parkLatitude = "return err"
          this.parkLongitude = "return err"
        }
        for (let i = 0; i < option.length; i++) {
          let time = option[i].time
          time = time.split("-")
          let s = time[0]
          let e = time[1]
          s = s.split(".")
          e = e.split(".")
          var now = new Date()
          var month = now.getMonth() + 1
          if (s[1] == month) {
            let t = new RESP
            t.isPaid = option[i].isPaid
            t.isDone = option[i].isDone
            t.parkLocation = option[i].parkLocation
            t.fee = option[i].pay
            t.recordId = option[i].id
            t.parkId = option[i].parking
            t.startTime = s[3] + ":" + s[4]
            t.startDate = s[0] + "-" + s[1] + "-" + s[2]
            t.endTime = e[3] + ":" + e[4]
            t.endDate = e[0] + "-" + e[1] + "-" + e[2]
            t.parkLatitude = option[i].lola.split(",")[1]
            t.parkLongitude = option[i].lola.split(",")[0]
            all.push(t)
          }
        }
        all = all.reverse()
        ctx.body = all.slice((ctx.request.body.delta - 1) * 10, ctx.request.body.delta * 10)
      }
      else if (ctx.request.body.filter == "all") {
        all = []
        function RESP() {
          this.isPaid = "return err"
          this.isDone = "return err"
          this.parkLocation = "return err"
          this.startTime = "return err"
          this.startDate = "return err"
          this.endTime = "return err"
          this.endDate = "return err"
          this.fee = "return err"
          this.recordId = "return err"
          this.parkId = "return err"
          this.parkLatitude = "return err"
          this.parkLongitude = "return err"
        }
        for (let i = 0; i < option.length; i++) {
          let time = option[i].time
          time = time.split("-")
          let s = time[0]
          let e = time[1]
          s = s.split(".")
          e = e.split(".")

          let t = new RESP
          t.isPaid = option[i].isPaid
          t.isDone = option[i].isDone
          t.parkLocation = option[i].parkLocation
          t.fee = option[i].pay
          t.recordId = option[i].id
          t.parkId = option[i].parking
          t.startTime = s[3] + ":" + s[4]
          t.startDate = s[0] + "-" + s[1] + "-" + s[2]
          t.endTime = e[3] + ":" + e[4]
          t.endDate = e[0] + "-" + e[1] + "-" + e[2]
          t.parkLatitude = option[i].lola.split(",")[1]
          t.parkLongitude = option[i].lola.split(",")[0]
          all.push(t)

        }
        all = all.reverse()
        ctx.body = all.slice((ctx.request.body.delta - 1) * 10, ctx.request.body.delta * 10)
      }
    })
  }
  else if (ctx.request.body.type == "add") {
    ctx.body = {1:1}
    let time = ctx.request.body.startDate.split("-").concat(ctx.request.body.startTime.split(":"))
    time = time[0] + "." + time[1] + "." + time[2] + "." + time[3] + "." + time[4]
    request('http://apis.map.qq.com/ws/geocoder/v1/?location=' + ctx.request.body.parkLocation + '&key=H4CBZ-CPYWK-2ZOJO-ACLVD-POMLE-FBBDZ&get_poi=1', function (error, response, body) {
      if (error) {
        ctx.body = { error }
      }
      else if (response.statusCode == 200) {
console.log(body)
        if (JSON.parse(body).result.pois != "") {
          fc.addhistory(ctx.request.body.parkId, time, null, ctx.request.body.carNumber, ctx.request.body.parkLocation, ctx.request.body.openId,JSON.parse(body).result.formatted_addresses.recommend)
       ctx.body={result:"ok"}
        }
        ctx.body={err:"经纬度不正常！"}
      }
      else {
        ctx.body =("response.statusCode != 200");
      }
    })

  }
  else if (ctx.request.body.type == "cancel") {
    ctx.body = {1:1}
    fc.selecthistory("openid", ctx.request.body.openId, function (option) {
      console.log(option)
      for (let i = option.length - 1; i >= 0; i--) {
        console.log(i)
        if (ctx.request.body.carNumber == option[i].carNumber) {
          console.log(option[i].id)
          fc.deletehistory(option[i].id)
          break
        }
      }
    })

  }
  else if (ctx.request.body.type == "done") {
    ctx.body = {1:1}
    fc.selecthistory("openid", ctx.request.body.openId, function (option) {
      for (let i = option.length - 1; i >= 0; i--) {
        if (ctx.request.body.carNumber == option[i].carNumber) {
          let time = ctx.request.body.endDate.split("-").concat(ctx.request.body.endTime.split(":"))
          nt = option[i].time + "-" + time[0] + "." + time[1] + "." + time[2] + "." + time[3] + "." + time[4]
          fc.changeone("history", option[i].id, "time", nt)
          fc.changeone("history", option[i].id, "isDone", 1)
          break
        }
      }
    })
  }
  else if (ctx.request.body.type == "pay") {
    ctx.body = {1:1}
    fc.selecthistory("openid", ctx.request.body.openId, function (option) {
      let time = ctx.request.body.startDate.split("-").concat(ctx.request.body.startTime.split(":"))
      time = time[0] + "." + time[1] + "." + time[2] + "." + time[3] + "." + time[4]
      for (let i = option.length - 1; i >= 0; i--) {
        if (ctx.request.body.carNumber == option[i].carNumber && option[i].time.split("-")[0] == time) {
          fc.changeone("history", option[i].id, "pay", ctx.request.body.fee)
          fc.changeone("history", option[i].id, "isPaid", 1)
          break
        }
      }
    })
  }
}
