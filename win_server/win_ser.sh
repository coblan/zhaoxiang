/usr/sbin/nginx
. /pypro/dj19/bin/activate
cd /pypro/zhaoxiang/deploy/
uwsgi zhaoxiang_uwsgi.ini
cd /pypro/xuncha/deploy
uwsgi xuncha_win_uwsgi.ini