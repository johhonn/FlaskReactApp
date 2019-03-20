from flask import request, render_template, jsonify, url_for, redirect, g,flash
from .models import User,  Article
from index import app, db
from sqlalchemy.exc import IntegrityError
from .utils.auth import generate_token, requires_auth, verify_token


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


@app.route("/api/user", methods=["GET"])
@requires_auth
def get_user():
    return jsonify(result=g.current_user)


@app.route("/api/create_user", methods=["POST"])
def create_user():
    incoming = request.get_json()
    user = User(
        email=incoming["email"],
        password=incoming["password"]
    )
    db.session.add(user)
    
    try:
        db.session.commit()
    except IntegrityError:
        return jsonify(message="User with that email already exists"), 409

    new_user = User.query.filter_by(email=incoming["email"]).first()

    return jsonify(
        id=user.id,
        token=generate_token(new_user)
    )


@app.route("/api/get_token", methods=["POST"])
def get_token():
    incoming = request.get_json()
    user = User.get_user_with_email_and_password(
        incoming["email"], incoming["password"])
    if user:
        return jsonify(token=generate_token(user))

    return jsonify(error=True), 403


@app.route("/api/is_token_valid", methods=["POST"])
def is_token_valid():
    incoming = request.get_json()
    is_valid = verify_token(incoming["token"])

    if is_valid:
        return jsonify(token_is_valid=True)
    else:
        return jsonify(token_is_valid=False), 403


@app.route("/api/add_article", methods=["Get", "Post"])
@requires_auth        
def add_article():
    print(g.current_user.id)
    incoming = request.get_json()
    article = Article(
        title=incoming["title"], 
        link=incoming["link"], user_id=g.current_user.id)
    db.session.add(article)
    db.session.commit()
    flash('Your post has been created!', 'success')
    return article


@app.route("/api/add_token", methods=["Post"])
##@requires_auth        
def add_token():
    ##print(g.current_user)
    ##ID=g.current_user['id']
   
    incoming = request.get_json()
    SelectedUser = User.query.get_or_404(incoming["ID"])
    print(incoming["TokenList"])
    SelectedUser.tokens = incoming["TokenList"]
    print(SelectedUser.tokens)
    print(SelectedUser.id)
    print(SelectedUser.email)
    db.session.commit()
    
    return "success"




@app.route("/api/Articles", methods=["Get"])
@requires_auth        
def load_articles():
    print(g.current_user.id)
    Articles = Article.query.filter_by(g.current_user.id)
    return Articles   