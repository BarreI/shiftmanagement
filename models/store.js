'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Stores = loader.database.define (
  'stores',
  {
    storeid:{
      type: Sequelize.STRING,
      primaryKey: true,
      allownull: false
    },
    storename:{
      type: Sequelize.STRING,
      allownull: false
    },
    ownerid:{
      type: Sequelize.UUID,
      allownull: false
    },
    comment:{
      type: Sequelize.TEXT,
      allownull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Stores;

/**
 * ガンとチャートを作る上で明らかに必要なこと
 * 営業時間
 * 給金   // 悩みどころ 
 * 
 * 案一
 * 給金は個人のデータなのでaffに持たせる
 * 今考えている懸念は指定時間での労働で給金が上がること
 * もちろん全てのデータには対応できないがそれもれで後から給与計算にたす方法が求められる
 * 
 * 
 * 現状、通常給金、所定時間労働給金の二つのデータを持たせる
 * 
 * 営業日 //データとして持つことは厳しいのでshiftsテーブルの方でデータがないとして対応する
 * 
 */