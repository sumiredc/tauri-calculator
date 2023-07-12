import BigNumber from "bignumber.js"

new (class {
  private rewriteFlg: boolean = false
  private symbol: string = ""
  private memory: string = ""
  private display: string = "0"
  private before: string = ""

  private displayEl: HTMLInputElement =
    document.querySelector<HTMLInputElement>('[name="display"]')!

  constructor() {
    this.event()
  }

  /**
   * イベント割当
   *
   * @return {void}
   */
  private event(): void {
    document
      .querySelectorAll<HTMLButtonElement>("button[data-btn]")
      .forEach((e) => {
        e.addEventListener("click", (_): void => {
          const btn: string = String(e.dataset.btn)

          if (this.rewriteFlg) {
            this.display = ""
          }

          if (/[0-9]{1}/.test(btn)) {
            // 数値の入力
            this.num(btn, this.display)
          } else if (/^(\+|\-|÷|×)$/.test(btn)) {
            // 四則演算
            this.four(btn)
          }

          // 特殊ボタン
          switch (btn) {
            case "AC":
              this.ac()
              break

            case "+/-":
              this.plusMinus()
              break

            case "%":
              this.per()
              break

            case "=":
              this.equal()
              break

            case ".":
              this.period()
              break
          }

          this.update(btn)
        })
      })
  }

  /**
   * 画面へ反映
   *
   * @return {void}
   */
  private update(btn: string): void {
    if (this.display === "" || this.display === "NaN") {
      this.display = "0"
    }
    if (this.memory === "NaN") {
      this.memory = ""
    }
    this.displayEl.value = this.display
    this.before = btn
  }

  /**
   * ----------------------------
   * ボタン操作
   * ----------------------------
   */

  /**
   * 四則演算
   *
   * @param {string} btn
   * @return {void}
   */
  private four(s: string): void {
    if (!this.rewriteFlg) {
      this.display = this.memory = String(
        this.cal(Number(this.display), this.symbol)
      )
    }
    if (/(\+|\-|÷|×|=)/.test(this.before)) {
      this.display = this.memory
    }
    this.symbol = s
    this.rewriteFlg = true
  }

  /**
   * リセット
   *
   * @return {void}
   */
  private ac(): void {
    this.display = "0"
    this.memory = ""
    this.symbol = ""
    this.rewriteFlg = false
  }

  /**
   * 数字の入力
   * @param {string} num
   * @param {string} val
   */
  private num(num: string, val: string): void {
    if (this.rewriteFlg) {
      this.display = "0"
      this.rewriteFlg = false
    }
    if (val === "0") {
      val = ""
    } else if (val === "-0") {
      val = "-"
    }
    this.display = val + num
  }

  /**
   * 符号処理
   *
   * @return {void}
   */
  private plusMinus(): void {
    const pm = /^\-/.test(this.display) ? "" : "-"
    this.display = pm + this.display.replace(/\-|\+/, "")
  }

  /**
   * パーセント
   *
   * @return {void}
   */
  private per(): void {
    if (this.before === "=") {
      this.display = this.memory
      this.rewriteFlg = false
    }
    if (this.rewriteFlg) {
      this.display = this.memory
      return
    }
    this.display = String(BigNumber(this.display).div(100))
    this.rewriteFlg = false
  }

  /**
   * 結果
   *
   * @return {void}
   */
  private equal(): void {
    if (this.before === "=") {
      this.display = this.memory
      return
    }
    this.display = this.memory = String(
      this.cal(Number(this.display), this.symbol)
    )
    this.symbol = ""
    this.rewriteFlg = true
  }

  /**
   * 小数点
   *
   * @return {void}
   */
  private period(): void {
    this.rewriteFlg = false
    if (this.display.indexOf(".") !== -1) {
      return
    }
    if (this.display === "") {
      this.display = "0"
    }
    this.display = this.display + "."
  }

  /**
   * ----------------------------
   * ロジック
   * ----------------------------
   */

  /**
   * 計算処理
   *
   * @param {number} v
   * @param {string} s
   * @return {number}
   */
  private cal(v: number, s: string): number {
    switch (s) {
      case "÷":
        return BigNumber(this.memory).div(v).toNumber()

      case "×":
        return BigNumber(this.memory).times(v).toNumber()

      case "-":
        return BigNumber(this.memory).minus(v).toNumber()

      case "+":
        return BigNumber(this.memory).plus(v).toNumber()

      default:
        return v
    }
  }
})()
