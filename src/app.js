const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const config = {
  jutuike: {
    apiUrl: 'http://api.jutuike.com/union/act',
    apiKey: 'Juybu1VagFj7RvAv0WYyWknJG7X8oiwu'
  }
};

const activityCatalog = [
  {
    activityType: 'meituan_air_train_school',
    activityName: '美团机票火车票开学季福利卷',
    actId: '48',
    category: '热门优惠（机票/火车票）',
    desc: '美团官方机票火车票优惠，含开学季专属福利'
  },
  {
    activityType: 'meituan_train_cpa',
    activityName: '美团火车票订票活动',
    actId: '135',
    category: '热门优惠（机票/火车票）',
    desc: '新用户购票有优惠'
  },
  {
    activityType: 'online_car_new_old',
    activityName: '网约车顺风车不限新老有折扣',
    actId: '42',
    category: '出行类活动（网约车/顺风车）',
    desc: '出行必领'
  },
  {
    activityType: 'huaxiaozhu_cpa',
    activityName: '花小猪特价打车',
    actId: '44',
    category: '出行类活动（网约车/顺风车）',
    desc: '特价拼车'
  },
  {
    activityType: 'online_car_daijia',
    activityName: '网约车&代驾服务活动',
    actId: '61',
    category: '出行类活动（网约车/代驾）',
    desc: '包含网约车和代驾'
  },
  {
    activityType: 'tongcheng_taxi',
    activityName: '同程打车/顺风车',
    actId: '87',
    category: '出行类活动（网约车/顺风车）',
    desc: '同程打车旅游出行打车首选'
  },
  {
    activityType: 'meituan_hotel',
    activityName: '美团酒店',
    actId: '10',
    category: '酒店类活动',
    desc: '根据用户位置推荐美团酒店优惠'
  },
  {
    activityType: 'tongcheng_hotel_cps',
    activityName: '同程酒店',
    actId: '94',
    category: '酒店类活动',
    desc: '同程酒店超低价预订'
  },
  {
    activityType: 'feizhu_hotel_daily',
    activityName: '飞猪酒店天天特惠活动',
    actId: '146',
    category: '酒店类活动',
    desc: '飞猪每日酒店特惠'
  },
  {
    activityType: 'feizhu_hotel_redpack',
    activityName: '飞猪酒店',
    actId: '29',
    category: '酒店类活动',
    desc: '飞猪酒店专属红包'
  },
  {
    activityType: 'feizhu_hotel_air_ticket',
    activityName: '飞猪酒店机票火车票门票多合一会场',
    actId: '120',
    category: '机票&门票类活动',
    desc: '飞猪多品类优惠一条龙'
  },
  {
    activityType: 'feizhu_ticket_cheap',
    activityName: '飞猪特价门票',
    actId: '148',
    category: '机票&门票类活动',
    desc: '飞猪景点特价门票'
  },
  {
    activityType: 'jd_food_cps',
    activityName: '京东品质外卖活动',
    actId: '23',
    category: '外卖类活动',
    desc: '京东外卖 打工人必备折扣多'
  },
  {
    activityType: 'meituan_waimai_cps',
    activityName: '美团外卖超级券',
    actId: '1',
    category: '外卖类活动',
    desc: '美团外卖 领券不亏'
  },
  {
    activityType: 'group_buy_discount',
    activityName: '团购内部优惠（吃喝玩乐1折起）',
    actId: '82',
    category: '外卖类活动',
    desc: '包含餐饮、娱乐等团购优惠，低至1折'
  },
  {
    activityType: 'meituan_free_taste',
    activityName: '美团试吃官、每日0元点外卖',
    actId: '39',
    category: '其他活动（试吃/团购/景点）',
    desc: '零元试吃活动'
  },
  {
    activityType: 'jd_group_buy_cps',
    activityName: '京东团购、购票游玩有折扣',
    actId: '72',
    category: '其他活动（试吃/团购/景点）',
    desc: '京东团购有优惠'
  },
  {
    activityType: 'scenic_ticket_summer',
    activityName: '景点游玩暑期水乐园门票',
    actId: '130',
    category: '其他活动（试吃/团购/景点）',
    desc: '暑期景点及水乐园门票优惠'
  }
];

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/mcp/jutuike/public_promo_list', async (req, res) => {
  try {
    const activitiesWithLinks = await Promise.all(
      activityCatalog.map(async (activity) => {
        try {
          const jtkResponse = await axios.get(config.jutuike.apiUrl, {
            params: {
              apikey: config.jutuike.apiKey,
              sid: 'default',
              act_id: activity.actId
            },
            timeout: 10000
          });

          const jtkData = jtkResponse.data;
          let link = '';
          let miniAppLink = {};

          if (jtkData.code === 1) {
            link = jtkData.data.h5 || jtkData.data.long_h5 || '';
            miniAppLink = jtkData.data.we_app_info || {};
          }

          return {
            ...activity,
            link,
            miniAppLink
          };
        } catch (error) {
          return {
            ...activity,
            link: '',
            miniAppLink: {}
          };
        }
      })
    );

    res.json({ code: 200, data: activitiesWithLinks });
  } catch (error) {
    res.status(500).json({ code: 500, msg: `Server Error: ${error.message}` });
  }
});

app.get('/api/mcp/jutuike/get_promo', async (req, res) => {
  const { actId } = req.query;
  if (!actId) {
    res.status(400).json({ code: 400, msg: 'actId is required' });
    return;
  }

  try {
    const activity = activityCatalog.find((item) => item.actId === actId);
    if (!activity) {
      res.status(404).json({ code: 404, msg: 'Activity not found' });
      return;
    }

    const jtkResponse = await axios.get(config.jutuike.apiUrl, {
      params: {
        apikey: config.jutuike.apiKey,
        sid: 'default',
        act_id: activity.actId
      },
      timeout: 10000
    });

    if (jtkResponse.data.code !== 1) {
      res.status(502).json({ code: 502, msg: 'Upstream error', detail: jtkResponse.data.msg });
      return;
    }

    const data = jtkResponse.data.data;
    res.json({
      code: 200,
      data: {
        activity,
        realLinks: {
          promoH5: data.h5 || data.long_h5 || '',
          deeplink: data.long_url || data.short_url || '',
          miniApp: data.we_app_info || {}
        }
      }
    });
  } catch (error) {
    res.status(500).json({ code: 500, msg: `Server Error: ${error.message}` });
  }
});

app.get('/.well-known/ai-plugin.json', (req, res) => {
  res.json({
    schema_version: 'v1',
    name: {
      en: 'PublicPromoMCP'
    },
    description_for_human: '开放式公共优惠查询 MCP 服务端',
    description_for_model: '提供查询公共优惠活动列表和活动详情的开放接口，无需认证。',
    auth: {
      type: 'none'
    },
    api: {
      type: 'openapi',
      url: `${getHost(req)}/openapi.yaml`
    },
    contact_email: 'support@example.com',
    legal_info_url: 'https://example.com/legal'
  });
});

app.get('/openapi.yaml', (req, res) => {
  res.type('yaml');
  res.send(generateOpenApiSpec(getHost(req)));
});

function getHost(req) {
  const hostHeader = req.get('host');
  const protocol = req.protocol || 'http';
  return `${protocol}://${hostHeader}`;
}

function generateOpenApiSpec(baseUrl) {
  return `openapi: 3.0.1
info:
  title: Public Promo MCP API
  description: Public endpoints for retrieving promotion data without authentication.
  version: '1.0.0'
servers:
  - url: ${baseUrl}
paths:
  /api/mcp/jutuike/public_promo_list:
    get:
      summary: List promotions
      responses:
        '200':
          description: Successful response
  /api/mcp/jutuike/get_promo:
    get:
      summary: Get promotion detail
      parameters:
        - name: actId
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful response
`;
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`MCP Public Promo Server is running on http://localhost:${PORT}`);
});
