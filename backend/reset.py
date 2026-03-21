from app import app, db, Admin

with app.app_context():
    db.create_all()
    admin = Admin.query.first()
    if admin:
        admin.username = 'admin'
        admin.password = 'admin123'
        print('Password reset done!')
    else:
        db.session.add(Admin(username='admin', password='admin123'))
        print('Admin created!')
    db.session.commit()
