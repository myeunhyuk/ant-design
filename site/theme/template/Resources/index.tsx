import * as React from 'react';
import collect from 'bisheng/collect';
import { useIntl } from 'react-intl';
import { Typography } from 'antd';
import Article from '../Content/Article';
import * as utils from '../utils';
import './index.less';

const { Title } = Typography;

interface PageData {
  meta: {
    order?: number;
    title: string;
    filename: string;
  };
  content: any[];
  toc: any[];
}

interface PagesData {
  'docs/resources': {
    docs: {
      resources: {
        [locale: string]: () => Promise<PageData>;
      };
    };
  };
}

interface ResourcesProps {
  location: {
    pathname: string;
  };
  data: PagesData;
  localizedPageData: PageData;
  utils: {
    toReactComponent: (content: any[]) => React.ReactElement;
    get: (data: PagesData, path: string[]) => any;
  };
}

const Resources = (props: ResourcesProps) => {
  const { localizedPageData } = props;
  const { locale } = useIntl();

  console.log('>>>', props);

  return (
    <div id="resources-page">
      <Article
        {...props}
        content={localizedPageData}
        intl={{ locale }}
        titleRegionClassName="title-region"
      />
    </div>
  );
};

export default collect(async (nextProps: ResourcesProps) => {
  const { pathname } = nextProps.location;
  const pageDataPath = pathname.replace('-cn', '').split('/');
  const pageData = nextProps.utils.get(nextProps.data, pageDataPath);

  const locale = utils.isZhCN(pathname) ? 'zh-CN' : 'en-US';
  const pageDataPromise = pageData[locale]();
  return { localizedPageData: await pageDataPromise };
})(Resources);
