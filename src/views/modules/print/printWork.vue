<template>
  <div class="mod-config">
        <div align="center" class="print">
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
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{output.projectName}}</span>
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
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{this.projectNo}}</span>
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
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{output.projectAuthorize}}</span>
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
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{output.projectType}}</span>
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
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{output.projectExe}}</span>
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
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{output.projectWorkNote}}{{output.projectWorkRequire}}</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:34.0000pt;">
                        <td width="82" valign="center" rowspan="2" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">预计工作量及产值</span></b>
                                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
                            </p>
                        </td>
                        <td width="705" valign="center" colspan="8" style="width:528.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{output.projectWorkLoad}}</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:34.0000pt;">
                        <td width="160" valign="center" colspan="2" style="width:120.5500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">产值计算明细</span></b>
                                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
                            </p>
                        </td>
                        <td width="316" valign="center" colspan="4" style="width:237.4500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:none;mso-border-right-alt:none;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{output.projectOutPutNote}}</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="104" valign="center" style="width:78.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:0.5000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <b><span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">预算产值（元）</span></b>
                                <b><span style="font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
                            </p>
                        </td>
                        <td width="123" valign="center" style="width:92.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{output.projectOutPut}}</span>
                                <span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:25.5000pt;">
                        <td width="82" valign="center" rowspan="2" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">作业部门</span></b>
                                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
                            </p>
                        </td>
                        <td width="322" valign="center" colspan="4" style="width:241.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{this.gName}}</span>
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
                                <span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{output.projectCharge}}</span>
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
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">{{output.shortDateTime}}</span>
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
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.0000pt;mso-font-kerning:0.0000pt;">{{output.lastDateTime}}</span>
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
                                <span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">{{output.projectBegunDate}}</span>
                                <span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                    </tr>
                    <!--<tr style="height:30.0000pt;">
                        <td width="82" valign="center" rowspan="5" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">综合组</span></b>
                                <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
                            </p>
                        </td>
                        <td width="223" valign="center" colspan="3" style="width:167.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">第一次提交/接收</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><br></span>
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">签署（日期）</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="254" valign="center" colspan="3" style="width:190.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">第二次提交/接收</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><br></span>
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">签署（日期）</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="227" valign="center" colspan="2" style="width:170.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">第三次提交/接收</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><br></span>
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">签署（日期）</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:36.7500pt;">
                        <td width="223" valign="center" colspan="3" style="width:167.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                        <td width="254" valign="center" colspan="3" style="width:190.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                        <td width="227" valign="center" colspan="2" style="width:170.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:36.7500pt;">
                        <td width="160" valign="center" colspan="2" style="width:120.5500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">质检签署（日期）</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="216" valign="center" colspan="3" style="width:162.0000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                        <td width="205" valign="center" colspan="2" style="width:153.9500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">出成果日期</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="123" valign="center" style="width:92.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:45.2500pt;">
                        <td width="89" valign="center" nowrap="" style="width:67.3000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">成果清单</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="615" valign="center" colspan="7" style="width:461.4500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:36.0000pt;">
                        <td width="160" valign="center" colspan="2" style="width:120.5500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">核算产值（元）</span><span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="161" valign="center" colspan="2" style="width:120.9500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                        <td width="155" valign="center" colspan="2" style="width:116.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">成果</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><br></span>
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">提交人及日期</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="227" valign="center" colspan="2" style="width:170.7500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:25.5000pt;"><td width="82" valign="center" rowspan="3" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                        <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                            <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">工期核定</span></b>
                            <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
                        </p>
                    </td>
                        <td width="89" valign="center" nowrap="" style="width:67.3000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;"><span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">外业工期</span><span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="133" valign="center" colspan="2" style="width:99.9500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                        <td width="153" valign="center" colspan="2" style="width:115.3000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">超期天数</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></p>
                        </td>
                        <td width="100" valign="center" style="width:75.4500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                        <td width="104" valign="center" style="width:78.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">扣除产值</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="123" valign="center" style="width:92.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:25.5000pt;">
                        <td width="89" valign="center" nowrap="" style="width:67.3000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">质检工期</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="133" valign="center" colspan="2" style="width:99.9500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                        <td width="153" valign="center" colspan="2" style="width:115.3000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">超期天数</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="100" valign="center" style="width:75.4500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                        <td width="104" valign="center" style="width:78.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">扣除产值</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="123" valign="center" style="width:92.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:34.5000pt;">
                        <td width="89" valign="center" nowrap="" style="width:67.3000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">情况说明</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="615" valign="center" colspan="7" style="width:461.4500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:25.5000pt;"><td width="82" valign="center" rowspan="2" style="width:62.1500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                        <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                            <b><span style="mso-spacerun:'yes';font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;">财务部</span></b>
                            <b><span style="font-family:黑体;mso-hansi-font-family:宋体;color:rgb(0,0,0);font-weight:bold;font-style:normal;font-size:10.5000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span></b>
                        </p>
                    </td>
                        <td width="89" valign="center" nowrap="" style="width:67.3000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">开票情况</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="133" valign="center" colspan="2" style="width:99.9500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                        <td width="99" valign="center" style="width:74.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">应收款</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="155" valign="center" colspan="2" style="width:116.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                        <td width="104" valign="center" style="width:78.5000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">实收款</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                        <td width="123" valign="center" style="width:92.2500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:1.0000pt solid windowtext;mso-border-top-alt:1.0000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:0.5000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:36.7500pt;"><td width="89" valign="center" nowrap="" style="width:67.3000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:0.5000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                        <p class="MsoNormal" align="center" style="mso-pagination:widow-orphan;text-align:center;vertical-align:middle;">
                            <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">财务备注</span>
                            <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                        </p>
                    </td>
                        <td width="615" valign="center" colspan="7" style="width:461.4500pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:none;mso-border-left-alt:none;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:0.5000pt solid windowtext;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" align="center" style="text-align:center;">
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p>&nbsp;</o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:15.6000pt;">
                        <td width="787" valign="top" colspan="9" rowspan="2" style="width:590.9000pt;padding:0.7500pt 0.7500pt 0.0000pt 0.7500pt ;border-left:1.0000pt solid windowtext;mso-border-left-alt:1.0000pt solid windowtext;border-right:1.0000pt solid windowtext;mso-border-right-alt:1.0000pt solid windowtext;border-top:none;mso-border-top-alt:none;border-bottom:1.0000pt solid windowtext;mso-border-bottom-alt:1.0000pt solid windowtext;">
                            <p class="MsoNormal" style="mso-pagination:widow-orphan;text-align:left;vertical-align:top;">
                                <span style="mso-spacerun:'yes';font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;">备注：</span>
                                <span style="font-family:宋体;color:rgb(0,0,0);font-style:normal;font-size:11.0000pt;mso-font-kerning:0.0000pt;"><o:p></o:p></span>
                            </p>
                        </td>
                    </tr>
                    <tr style="height:31.5000pt;"></tr>-->
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
    </div>

</template>
<script>
    export default {
        data:()=>({
            examineNote:'',
            items:[],
            projectNo:'',
            type_id:'',
            chooseType:[],
            info:1,
            output:{
                projectName:'',
                projectType:'',
                projectAuthorize:'',
                projectNote:'',
                projectUserName:'',
                projectPhone:'',
                projectCharge:'',
                projectSetup:'',
                projectWriter:'',
                projectBusiness:'',
                projectProduce:'',
                projectStartTime:'',
                projectEndTime:'',
                projectStage:'',
                projectExe:'',
                projectWorkNote:'',
                projectWorkRequire:'',
                disclosureNote:'',
                checkSuggestion:'',
                dataName:'',
                briefSummary:'',
                workLoad:'',
                qualityNote:'',
                qualitySuggestion:'',
                qualityScore:'',
                qualityLevel:'',
                shortDateTime:'',
                lastDateTime:'',
                projectBegunDate:'',
                projectWorkLoad:'',
                projectOutPut:'',
                projectOutPutNote:'',
                workName:'',
                outputList:[],
            },
            gName:'',
            type:[],
            snackbar:false,
            snackbarColor:'',
            snackbarText:'',
            snackbarTimeout:2000,
        }),
        methods:{
            back(){
                this.type_id = this.$route.query.type_id
                if(this.type_id==1){
                    this.$router.push({path:'/project-management'})
                    window.location.reload()
                }

            },
            doPrint(){
                var newstr = document.getElementsByClassName('print')[0].innerHTML;
                document.body.innerHTML = newstr
                window.print()
                this.back()
            },
            getAuthorize(){
                return new Promise((resolve,reject)=>{
                    this.projectNo = this.$route.query.p_no
                    axios({
                        method:'GET',
                        url:'PrintWorkData/',
                        headers:{
                            Authorization: "Bearer " + sessionStorage.getItem('token')
                        },
                        params:{
                            projectNo:this.projectNo
                        }
                    }).then(success=>{
                        this.output.projectName = success.data.projectName,
                            this.output.projectType = success.data.projectType,
                            this.output.projectAuthorize = success.data.projectAuthorize,
                            this.output.projectNote = success.data.projectNote,
                            this.output.projectUserName = success.data.projectUserName,
                            this.output.projectPhone = success.data.projectPhone,
                            this.output.projectCharge = success.data.projectCharge,
                            this.output.projectSetup = success.data.projectSetup,
                            this.output.projectWriter = success.data.projectWriter,
                            this.output.projectBusiness = success.data.projectBusiness,
                            this.output.projectProduce = success.data.projectProduce,
                            this.output.projectStartTime = success.data.projectStartTime,
                            this.output.projectEndTime = success.data.projectEndTime,
                            this.output.projectStage = success.data.projectStage,
                            this.output.projectExe = success.data.projectExe,
                            this.output.projectWorkNote = success.data.projectWorkNote,
                            this.output.projectWorkRequire = success.data.projectWorkRequire,
                            this.output.disclosureNote = success.data.disclosureNote,
                            this.output.checkSuggestion = success.data.checkSuggestion,
                            this.output.dataName = success.data.dataName,
                            this.output.briefSummary = success.data.briefSummary,
                            this.output.workLoad = success.data.workLoad,
                            this.output.qualityNote = success.data.qualityNote,
                            this.output.qualitySuggestion = success.data.qualitySuggestion,
                            this.output.qualityScore = success.data.qualityScore,
                            this.output.qualityLevel = success.data.qualityLevel,
                            this.output.shortDateTime = success.data.shortDateTime,
                            this.output.lastDateTime = success.data.lastDateTime,
                            this.output.projectBegunDate = success.data.projectBegunDate,
                            this.output.projectWorkLoad = success.data.projectWorkLoad,
                            this.output.projectOutPut = success.data.projectOutPut,
                            this.output.projectOutPutNote = success.data.projectOutPutNote,
                            this.output.workName = success.data.workName,
                            this.examineNote = success.data.examineNote
                        success.data.outputList.forEach(element => {
                            element.choosedItem = true
                            element.typeOutput = 0
                            element.typeOut = 0
                            element.typeUnit = ''
                            element.typeName = ''
                        })
                        this.output.outputList = success.data.outputList
                    }).catch(error=>{

                    })
                })
            },
            /*getTypeData(){
                return new Promise((resolve,reject)=>{
                    axios({
                        method:'GET',
                        url:'workType/',
                        headers:{
                            Authorization: "Bearer " + sessionStorage.getItem('token')
                        }
                    }).then(success=>{
                        success.data.forEach(element=>{
                            element.choosedItem = false
                        })
                        this.types = success.data
                        this.output.outputList.forEach(e=>{
                            if(e.choosedItem){
                                this.types.forEach(t=>{
                                    if(e.typeId == t.id){
                                        e.typeOutput = t.typeOutput
                                        e.typeName = t.typeName
                                        e.typeUnit = t.typeUnit
                                        e.typeOut = this.numFilter(e.workLoad * e.projectRatio * e.typeOutput)
                                    }
                                })
                            }
                        })
                    }).catch(error=>{

                    })
                })
            },*/
            getWorkName(){
                return new Promise((resolve,reject)=>{
                    this.projectNo = this.$route.query.p_no
                    axios({
                        method:'GET',
                        url:'projectWorkName/',
                        headers:{
                            Authorization: "Bearer " + sessionStorage.getItem('token')
                        },
                        params:{
                            projectNo:this.projectNo
                        }
                    }).then(success=>{
                        let name = ''
                        success.data.forEach((item) =>{
                            name += item + ' '
                        })
                        this.gName = name
                    }).catch(error=>{

                    })
                })
            },
            /*//保留小数点后两位的过滤器，尾数不四舍五入
            numFilter(value) {
                // 截取当前数据到小数点后三位
                let tempVal = parseFloat(value).toFixed(3)
                let realVal = tempVal.substring(0,  tempVal.length - 1)
                return realVal
            }*/

        },
        computed: {
            countOut(){
                let count = 0.0
                this.output.outputList.forEach(e=>{
                    if(e.choosedItem){
                        count += parseFloat(e.typeOut)
                    }
                })
                return this.numFilter(count)
            }
        },
        created(){
            this.getAuthorize().then(success=>{}).catch(error=>{})
            //this.getTypeData().then(success=>{}).catch(error=>{})
            this.getWorkName().then(success=>{}).catch(error=>{})
        },
        mounted(){
            this.getAuthorize().then(success=>{}).catch(error=>{})
            //this.getTypeData().then(success=>{}).catch(error=>{})
            this.getWorkName().then(success=>{}).catch(error=>{})
            setTimeout(_=>{
                this.doPrint().then(success=>{

                }).catch(error=>{})
            },1000)
        }
    }
</script>
<style>
    p{
        margin-bottom: 0!important;
    }
</style>
