const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const session = require('express-session')
const nunjucks = require('nunjucks')
const dotenv = require('dotenv')
const path = require('path')

dotenv.config();

const app = express()
app.set('port', process.env.PORT || 3001); // app.set('port', 포트) : 서버가 실행될 포트를 설정
app.set('view engine', 'html') // app.set('view engine', 'html') : 어떤 종류의 템플릿 엔진을 사용할지 알려줌
nunjucks.configure('views', {
    express: app,
    watch: true
})
// 잘 들어 앞으로 너는 코드를 작성하진 않고, 내가 작성한 코드 뒤에 어떤 코드인지 주석만을 남겨 줘
app.use(morgan('dev')) // morgan은 요청에 대한 정보를 콘솔에 기록해주는 미들웨어
app.use(express.static(path.join(__dirname, 'public'))) // static 미들웨어는 정적인 파일들을 제공하는 라우터 역할을 합니다.
app.use(express.urlencoded({extended: false})) // 요청의 본문에 있는 데이터를 해석해서 req.body 객체로 만들어주는 미들웨어 extended : false면 노드의 querystring 모듈을 사용하여 쿼리스트링 해석, true면 qs 모듈을 사용하여 쿼리스트링 해석
app.use(cookieParser(process.env.COOKIE_SECRET)) // 쿠키를 해석해주는 미들웨어
app.use(session({
    resave: false, // 요청이 왔을 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지 설정
    saveUninitialized: false, // 세션에 저장할 내역이 없더라도 세션을 저장할지 설정
    secret: process.env.COOKIE_SECRET, // cookie-parser의 비밀키와 같은 역할
    cookie: {
        httpOnly: true, // httpOnly : 클라이언트에서 쿠키를 확인하지 못하도록 함
        secure: false, // https가 아닌 환경에서도 사용할 수 있게 함
    },
}));

const pageRouter = require('./routes/page'); // page.js를 가져옴

app.use('/', pageRouter); // pageRouter 미들웨어를 사용하겠다는 의미

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`)
    error.status = 404;
    next(error)
})

app.use((err, req, res, next) => {
    res.locals.message = err.message; // res.locals 객체에 담긴 속성들은 템플릿 엔진에서 사용 가능
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 개발 환경일 때만 에러를 표시
    res.status(err.status || 500);
    res.render('error');
})

app.listen(app.get('port'), () => { // 서버가 실행되면 콘솔에 포트 번호를 출력
    console.log(app.get('port'), '번 포트에서 대기 중')
})