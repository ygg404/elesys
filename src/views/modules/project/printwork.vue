<template>
  <div class="mod-config">
    <div align="center" id="printId">
      <p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:16.0pt;font-family:黑体">任务单</span></p>
      <div align="center">
        <table class="MsoNormalTable" border="0" cellspacing="0" style="border-collapse:collapse;width:590.9000pt;margin-left:4.6500pt;border:none;mso-padding-alt:0.0000pt 0.0000pt 0.0000pt 0.0000pt ;">
          <tbody>
          <tr style="height:21.7500pt;">
            <td width="82" valign="center" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">项目名称</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
              </p>
            </td>
            <td width="477" valign="center" colspan="6" style="width:358.0000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectName}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
            <td width="104" valign="center" style="width:78.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">项目编号</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
              </p>
            </td>
            <td width="123" valign="center" style="width:92.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectNo}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
          </tr>
          <tr style="height:21.7500pt;">
            <td width="82" valign="center" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">委托单位</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
              </p>
            </td>
            <td width="477" valign="center" colspan="6" style="width:358.0000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectAuthorize}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
            <td width="104" valign="center" style="width:78.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">项目类型</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                </b>
              </p>
            </td>
            <td width="123" valign="center" style="width:92.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectType}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
          </tr>
          <tr style="height:70.5000pt;"><td width="82" valign="center" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
              <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">执行标准</span></b>
              <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
            </p>
          </td>
            <td width="705" valign="center" colspan="8" style="width:528.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.executeStandard}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
          </tr>
          <tr style="height:72.7500pt;"><td width="82" valign="center" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
              <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">作业内容及技术要求</span></b>
              <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
            </p>
          </td>
            <td width="705" valign="center" colspan="8" style="width:528.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.workNote}}{{projectInfo.workRequire}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
          </tr>
          <!--<tr style="height:34.0000pt;">-->
            <!--<td width="82" valign="center" rowspan="2" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">-->
              <!--<p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">-->
                <!--<b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">预计工作量及产值</span></b>-->
                <!--<b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>-->
              <!--</p>-->
            <!--</td>-->
            <!--<td width="705" valign="center" colspan="8" style="width:528.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">-->
              <!--<p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">-->
                <!--<span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectWorkload}}</span>-->
                <!--<span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>-->
              <!--</p>-->
            <!--</td>-->
          <!--</tr>-->
          <tr style="height:21.7500pt;">
            <td width="82" valign="center" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">预计工作量</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
              </p>
            </td>
            <td width="477" valign="center" colspan="6" style="width:358.0000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectWorkload}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
            <td width="104" valign="center" style="width:78.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">预算产值（元）</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                </b>
              </p>
            </td>
            <td width="123" valign="center" style="width:92.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectOutput}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
          </tr>

          <!--<tr style="height:34.0000pt;">-->
            <!--<td width="160" valign="center" colspan="2" style="width:120.5500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">-->
              <!--<p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">-->
                <!--<b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">产值计算明细</span></b>-->
                <!--<b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>-->
              <!--</p>-->
            <!--</td>-->
            <!--<td width="316" valign="center" colspan="4" style="width:237.4500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:none;mso-border-right-alt:none;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">-->
              <!--<p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">-->
                <!--<span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectWorkload}}</span>-->
                <!--<span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>-->
              <!--</p>-->
            <!--</td>-->
            <!--<td width="104" valign="center" style="width:78.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.5000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">-->
              <!--<p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">-->
                <!--<b><span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">预算产值（元）</span></b>-->
                <!--<b><span style="font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>-->
              <!--</p>-->
            <!--</td>-->
            <!--<td width="123" valign="center" style="width:92.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">-->
              <!--<p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">-->
                <!--<span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectOutput}}</span>-->
                <!--<span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>-->
              <!--</p>-->
            <!--</td>-->
          <!--</tr>-->
          <tr style="height:25.5000pt;">
            <td width="82" valign="center" rowspan="2" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">作业部门</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
              </p>
            </td>
            <td width="322" valign="center" colspan="4" style="width:241.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.groupName}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
            <td width="155" valign="center" colspan="2" style="width:116.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:none;mso-border-right-alt:none;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">项目负责人</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
              </p>
            </td>
            <td width="227" valign="center" colspan="2" style="width:170.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.5000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectCharge}}</span>
                <span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
          </tr>
          <tr style="height:25.5000pt;">
            <td width="89" valign="center" style="width:67.3000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">最短工期</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
              </p>
            </td>
            <td width="71" valign="center" style="width:53.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">{{projectInfo.shortDateTime}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
            <td width="62" valign="center" style="width:46.7000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;"><b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">最迟工期</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
              </p>
            </td>
            <td width="99" valign="center" style="width:74.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.0000pt;mso-font-kerning:0.0000pt;">{{projectInfo.lastDateTime}}</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
            <td width="155" valign="center" colspan="2" style="width:116.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">开工日期</span></b>
                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
              </p>
            </td>
            <td width="227" valign="center" colspan="2" style="width:170.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
              <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{projectInfo.projectBegunDateTime}}</span>
                <span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
              </p>
            </td>
          </tr>

          <tr style="height:17.2500pt;">
            <td width="82" valign="center" nowrap="" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:none;mso-border-right-alt:none;border-top:none;mso-border-top-alt:none;border-bottom:none;mso-border-bottom-alt:none;">
              <p class="MsoNormal">
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
              </p>
            </td>
            <td width="160" valign="center" nowrap="" colspan="2" style="width:120.5500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:none;mso-border-right-alt:none;border-top:none;mso-border-top-alt:none;border-bottom:none;mso-border-bottom-alt:none;">
              <p class="MsoNormal">
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
              </p>
            </td>
            <td width="62" valign="center" nowrap="" style="width:46.7000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:none;mso-border-right-alt:none;border-top:none;mso-border-top-alt:none;border-bottom:none;mso-border-bottom-alt:none;">、
              <p class="MsoNormal">
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
              </p>
            </td>
            <td width="153" valign="center" nowrap="" colspan="2" style="width:115.3000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:none;mso-border-right-alt:none;border-top:none;mso-border-top-alt:none;border-bottom:none;mso-border-bottom-alt:none;">
              <p class="MsoNormal">
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
              </p>
            </td>
            <td width="328" valign="center" nowrap="" colspan="3" style="width:246.2000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:none;mso-border-right-alt:none;border-top:none;mso-border-top-alt:none;border-bottom:none;mso-border-bottom-alt:none;">
              <p class="MsoNormal" align="right" style="mso-pagination:widow-orphan;text-align:right;vertical-align:middle;">
                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">广东杰信测绘科技有限公司</span>
                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></p>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div style="text-align: center;width: 100%;">
      <el-button type="primary" icon="el-icon-printer" size="large" @click="printChart">打印</el-button>
    </div>
  </div>
</template>

<script>
  import {closeTab} from '@/utils/tabs'

  export default {
    data () {
      return {
        projectInfo: ''
      }
    },
    mounted () {
      this.init()
    },
    methods: {
      init () {
        let projectNo = this.$route.query.projectNo
        this.getInfoByProjectNo(projectNo)
      },
      // 获取项目基本信息
      getInfoByProjectNo (projectNo) {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$http.adornUrl(`/project/projectInfo/print/${projectNo}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({data}) => {
            if (data && data.code === 0) {
              data.projectInfo.executeStandard = '☑' + data.projectInfo.executeStandard.replace(/;/g, '☑').slice(0, -1)
              this.projectInfo = data.projectInfo
              resolve(data.projectInfo)
            } else {
              this.$message.error(data.msg)
              reject(data.msg)
            }
          })
        })
      },
      // 打印报表
      printChart () {
        const print = document.getElementById('printId').innerHTML
        // 把当前页面替换成要打印的内容
        document.body.innerHTML = print
        // 打印
        window.print()
        // 刷新页面
        window.location.reload()
      },
      // 返回
      goBack () {
        console.log('goBack')
        closeTab('project-printwork')
      }
    },
    // watch: {
    //   '$route': function (to, from) {
    //     this.projectNo = to.query['projectNo']
    //     // 执行数据更新查询
    //     if (to.name === 'project-printwork') {
    //       this.init()
    //     } else {
    //       this.goBack()
    //     }
    //   }
    // }
  }
</script>

<style scoped>

</style>
