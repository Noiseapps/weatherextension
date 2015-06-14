<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

    <xsl:template match="/">
        <div class="row">
            <xsl:for-each select="forecast/time">
                <xsl:choose>
                    <xsl:when test="position() = 1">
                        <div class="col s2">
                            <xsl:value-of select="temperature/@day">

                            </xsl:value-of> °C
                        </div>
                    </xsl:when>
                    <xsl:otherwise>
                        <div class="col s1">

                        </div>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:for-each>
        </div>
    </xsl:template>

</xsl:stylesheet>