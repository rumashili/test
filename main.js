window._registerGameScript(function(Engine) {
// 状態を管理する変数（中心座標基準になりました！）
// 画面サイズは 800x600、中心が (0,0) なので
// Xは -400 〜 +400、Yは -300 〜 +300 の範囲になるよ。
let player = { x: 0, y: 0, w: 64, h: 64 };
let enemyCircle = { x: 200, y: 150, r: 40 };
let showDialogue = true;
let score = 0;

Engine.setInit(() => {
  Engine.log("新座標系のデモを開始！🚀");
});

// 新機能：コールバックでクリックイベントを取る！
Engine.onClick((x, y) => {
  enemyCircle.x = x;
  enemyCircle.y = y;
  Engine.log('Click! ワープしたよ: ' + Math.floor(x) + ', ' + Math.floor(y));
  
  // 新機能：画面揺らし（チート級演出！）
  Engine.Effect.shake(20);
});

// 新機能：メッセージを受け取る例
Engine.receiveMessage('addScore', (data) => {
  score += data.points;
});

Engine.setUpdate((dt) => {
  Engine.clear('#1e293b');

  const mouse = Engine.Input.getMouse();
  const speed = 300 * dt;

  // 上がプラス(+y), 右がプラス(+x) だよ！
  if (Engine.Input.getKey('ArrowRight')) player.x += speed;
  if (Engine.Input.getKey('ArrowLeft')) player.x -= speed;
  if (Engine.Input.getKey('ArrowUp')) player.y += speed;
  if (Engine.Input.getKey('ArrowDown')) player.y -= speed;

  // 画面端から出ないように制限 (X:-400~400, Y:-300~300)
  player.x = Engine.Math.clamp(player.x, -400 + player.w/2, 400 - player.w/2);
  player.y = Engine.Math.clamp(player.y, -300 + player.h/2, 300 - player.h/2);

  // 敵（円）は滑らかにマウスに追従
  enemyCircle.x = Engine.Math.lerp(enemyCircle.x, mouse.x, 0.05);
  enemyCircle.y = Engine.Math.lerp(enemyCircle.y, mouse.y, 0.05);

  // 新機能：レーザー描画！（LineAPI）
  Engine.drawLine(player.x, player.y, enemyCircle.x, enemyCircle.y, '#f59e0b', 4);

  // 四角(中心基準) と 円(中心基準) の当たり判定
  let isColliding = Engine.Math.Collision.rectCircle(
    player.x, player.y, player.w, player.h,
    enemyCircle.x, enemyCircle.y, enemyCircle.r
  );

  Engine.drawCircle(enemyCircle.x, enemyCircle.y, enemyCircle.r, isColliding ? '#ef4444' : '#8b5cf6');

  if (Engine.hasCostume('player')) {
    Engine.draw('player', player.x, player.y, player.w, player.h);
  } else {
    Engine.drawRect(player.x, player.y, player.w, player.h, '#38bdf8');
    Engine.drawText('🚀', player.x, player.y + 4, 32); // 中心基準で文字を描画
  }

  if (showDialogue) {
    // 画面中央 (0, -100) を中心としてダイアログを描画
    Engine.drawTextBox(
      "【連携＆独立アップデート！】\n・別のファイルで同じ変数名を使ってもエラーにならない！\n・sendMessage / receiveMessage で連携可能！\n・スクリプトを追加して試してみてね！\n※Enterキーで閉じるよ。",
      0, -100, 600, 180,
      { fontSize: 22, fontColor: '#f8fafc', bgColor: 'rgba(15, 23, 42, 0.85)', borderColor: '#38bdf8', borderWidth: 3, padding: 20 }
    );
    if (Engine.Input.getKeyDown('Enter')) {
      showDialogue = false;
      // 他のスクリプトにメッセージを送る例
      Engine.sendMessage('addScore', { points: 100 });
    }
  }

  // UI (左上に表示。左上は X:-380, Y:260 あたり)
  // drawUIText はカメラを動かしても常に同じ位置に表示されるよ！
  Engine.drawUIText('Arrow: Move / Click: Warp / Q,E: Zoom', -200, 260, 18, '#94a3b8');
  Engine.drawUIText('Score: ' + score, -320, 220, 24, '#fde047');

  // 新機能：カメラ操作のチート機能！
  if (Engine.Input.getKey('KeyQ')) Engine.Camera.zoom += 1 * dt;
  if (Engine.Input.getKey('KeyE')) Engine.Camera.zoom -= 1 * dt;
});
});